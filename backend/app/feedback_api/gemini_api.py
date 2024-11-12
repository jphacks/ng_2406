import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
import sys
from .weather_api import WeatherAPI
from .goolab_api import GoolabAPI

DEBUG = True


class GeminiAPI:
    def __init__(self):
        # 環境変数の読み込み
        load_dotenv()
        GeminiAPI_KEY = os.getenv('GeminiAPI_KEY')

        # APIキーの設定
        genai.configure(api_key=GeminiAPI_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.weather = WeatherAPI()
        self.goolab = GoolabAPI()

    def _generate_prompt(self, schedule):
        '''
        ユーザーが入力した内容から行動を抜き出すためのプロンプトを作成
        input(str) : schedule
        output(str) : prompt
        '''
        prompt_action = schedule
        prompt = (prompt_action
                  + "という文章から行動を抜き出してpythonの配列として出力してください。"
                  "回答は必ずpythonの配列形式で「['行動1', '行動2', ...]」のように"
                  "行動が文章から見つけられない場合は「[]」と出力してください。")
        return prompt

    def _is_used_weather_info(self, schedule):
        '''
        ユーザーの予定を見て、天気情報が必要かを判定する
        '''
        try:
            prompt = (schedule
                    + "という文章で外出する可能性が高い場合は1を、それ以外の場合は0を出力してください。"
                    "回答は必ず数値のみで「0」「1」のどちらかを返してください。")
            response = self.model.generate_content(prompt).text
            if DEBUG: print(response)
            res = int(response)
        except Exception as e:
            print(f"天気情報の判定に失敗しました: {e}")
            res = 0
        return res

    def extract_actions(self, schedule):
        if self.goolab.has_action_content(schedule) == False:
            return None
        actions = []
        prompt = self._generate_prompt(schedule)
        for _ in range(5):
            try:
                feedback = self.model.generate_content(prompt).text
                if DEBUG: print(feedback)

                # 正規表現で ```で囲まれた部分とその中の配列部分を抽出
                code_block_pattern = r"```(.+?)```"  # ```で囲まれた部分を取得
                array_pattern = r"\[([^\]]+)\]"     # []で囲まれた配列部分を取得

                # ```で囲まれたコードブロックを検索
                code_block_match = re.search(code_block_pattern, feedback, re.DOTALL)
                array_match = re.search(array_pattern, code_block_match.group(1))
                actions = [action.strip().strip('"') for action in array_match.group(1).split(",")]
                if DEBUG: print(actions)
                break
            except Exception as e:
                if DEBUG: print(f"行動の抽出に失敗しました: {e}")

        if actions == []:
            return None
        if self._is_used_weather_info(schedule):
            actions = ["天気情報"] + actions
        return actions

    def _get_facescore(self, action):
        '''
        行動から危険度を考える（危険度が高い順に2, 1, 0で返す）
        input : action(str) : 行動
        output : int : 感情の番号
        '''
        try:
            score = self.goolab.calculate_text_similarity(action, "危険")
            print(f"{action}の危険度: {score}")
            if score >= 0.6:
                return 2
            elif score >= 0.55:
                return 1
            else:
                return 0
        except Exception as e:
            print(f"危険度の計算に失敗しました: {e}")
            return 0

    def _get_weather_info(self):
        '''
        天気情報を取得する
        input : None
        output : str : 天気情報
        '''
        nagoya_city_number = 230010
        weather_data = self.weather.get_weather(nagoya_city_number)
        prompt = (weather_data + "ここから本日の天気情報を取り出し、おばあちゃん口調で30字以内のアドバイスをください")
        weather_info = self.model.generate_content(prompt).text
        return weather_info

    def _get_action_feedback(self, action):
        '''
        行動からフィードバックを生成する
        input : action(str) : 行動
        output : str : フィードバック
        '''
        prompt_description = (
            f"{action}の気をつけた方が良いポイントをおばあちゃん口調で60字以内で教えてください。"
        )
        for _ in range(3):
            try:
                feedback = self.model.generate_content(prompt_description).text
                return feedback
            except Exception as e:
                if DEBUG: print(f"おばあが怒っています: {e}")
        feedback_ng = "いまなんといったのかい？おばあちゃんが分かるようにゆっくり話しておくれ。"
        return feedback_ng 
        
    def action_feedback(self, action):
        '''
        ユーザーの行動データを受け取り、行動を抽出するAPI
        input : action(str)
        output : response(dict)
        '''
        if action == "天気情報":
            face = 1
            feedback = self._get_weather_info()
        else:
            face = self._get_facescore(action)
            feedback = self._get_action_feedback(action)
        response = {
            'face': face,
            'action': action,
            'feedback': feedback
        }
        return response

    def calendar_action_feedback(self, action):
        '''
        カレンダーの行動データを受け取り、行動を抽出するAPI
        input : action(str)
        output : response(dict)
        '''
        face = self._get_facescore(action)
        feedback = self._get_action_feedback(action)
        response = {
            'face': face,
            'action': action,
            'feedback': feedback
        }
        return response