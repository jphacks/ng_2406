import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
import sys
from .prompt_summary.grand_mother import GrandMother
from .prompt_summary.father import Father
from .prompt_summary.brother import Brother
from .prompt_summary.dog import Dog

DEBUG = True


class GeminiAPI:
    def __init__(self):
        # 環境変数の読み込み
        load_dotenv()
        GeminiAPI_KEY = os.getenv('GeminiAPI_KEY')

        # APIキーの設定
        genai.configure(api_key=GeminiAPI_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.prompt_summary = [GrandMother(), Father(), Brother(), Dog()]

    def _generate_prompt(self, schedule):
        '''
        ユーザーが入力した内容から行動を抜き出すためのプロンプトを作成
        input(str) : schedule
        output(str) : prompt
        '''
        prompt_action = schedule
        prompt = (prompt_action
                  + "という文章から行動を抜き出してpythonの配列として出力してください。"
                  "回答は必ずpythonの配列形式で出力してください。"
                  "もし行動が見つからなかった場合は何も返さないでください")
        return prompt

    def extract_actions(self, schedule):
        actions = []
        prompt = self._generate_prompt(schedule)
        for _ in range(5):
            try:
                feedback = self.model.generate_content(prompt).text
                if DEBUG: print(feedback)

                # []で囲まれた配列部分を取得
                array_pattern = r"\[([^\]]+)\]"
                array_match = re.search(array_pattern, feedback)
                actions = [str(action.strip().strip('"').strip("'")) for action in array_match.group(1).split(",")]
                if DEBUG: print(actions)
                break
            except Exception as e:
                if DEBUG: print(f"行動の抽出に失敗しました: {e}")

        if actions == []:
            return None
        return actions

    def __get_facescore(self, action):
        '''
        行動から危険度を考える（危険度が高い順に2, 1, 0で返す）
        input : action(str) : 行動
        output : int : 感情の番号
        '''
        prompt_description = f"""次の行動「{action}」の危険度を0〜2のいずれかの数字1文字で評価してください。
        説明は不要です。出力は「0」「1」「2」のいずれかの半角数字1文字だけにしてください。"""

        try:
            response = self.model.generate_content(prompt_description).text.strip()
            print(f"{action}の危険度（生返答）: {response}")
            
            if response.isdigit():
                score = int(response)
                if 0 <= score <= 2:
                    print(f"{action}の危険度: {score}")
                    return score

            # 無効な数値だった場合
            return 0
        except Exception as e:
            print(f"危険度の計算に失敗しました: {e}")
            return 0

    def __get_action_feedback(self, action, character):
        '''
        行動からフィードバックを生成する
        input : action(str) : 行動
        output : str : フィードバック
        '''
        prompt_description = self.prompt_summary[character].action_feedback(action)
        for _ in range(3):
            try:
                feedback = self.model.generate_content(prompt_description).text
                return False, feedback
            except Exception as e:
                if DEBUG: print(f"ハラスメントエラーです: {prompt_description}")
        error_message = self.prompt_summary[character].error_message()
        return True, error_message

    def _get_face_and_feedback(self, action, character):
        face = self.__get_facescore(action)
        (is_error, feedback) = self.__get_action_feedback(action, character)
        if is_error:
            face = 2
        face = self.__get_facescore(action)
        (is_error, feedback) = self.__get_action_feedback(action, character)
        if is_error:
            face = 2
        return face, feedback
        
    def action_feedback(self, action, character):
        '''
        ユーザーの行動データを受け取り、行動を抽出するAPI
        input : action(str)
        output : response(dict)
        '''
        face, feedback = self._get_face_and_feedback(action, character)
        response = {
            'face': face,
            'action': action,
            'feedback': feedback
        }
        return response

    def calendar_action_feedback(self, action, character):
        '''
        カレンダーの行動データを受け取り、フィードバックを生成するAPI
        input : action(str)
        output : response(dict)
        '''
        face, feedback = self._get_face_and_feedback(action, character)
        response = {
            'face': face,
            'action': action,
            'feedback': feedback
        }
        return response
