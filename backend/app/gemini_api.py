import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
import sys
from app.weather_api import WeatherAPI


class GeminiAPI:
    def __init__(self):
        # 環境変数の読み込み
        load_dotenv()
        GeminiAPI_KEY = os.getenv('GeminiAPI_KEY')

        # APIキーの設定
        genai.configure(api_key=GeminiAPI_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.weather = WeatherAPI()

    def _generate_prompt(self, schedule):
        '''
        ユーザーが入力した内容から行動を抜き出すためのプロンプトを作成
        input(str) : schedule
        output(str) : prompt
        '''
        prompt_action = schedule
        prompt = (prompt_action
                  + "という文章から行動を抜き出してpythonの配列として出力してください。")
        return prompt

    def extract_actions(self, schedule):
        prompt = self._generate_prompt(schedule)
        for _ in range(5):
            try:
                feedback = self.model.generate_content(prompt).text
                logger.info(feedback)
                
                # レスポンス形式の検証
                code_block_match = re.search(r"```(.+?)```", feedback, re.DOTALL)
                if code_block_match:
                    array_match = re.search(r"\[([^\]]+)\]", code_block_match.group(1))
                    if array_match:
                        actions = [action.strip().strip('"') for action in array_match.group(1).split(",")]
                        logger.info(actions)
                        return actions
                    else:
                        logger.warning("配列が見つかりませんでした。")
                else:
                    logger.warning("コードブロックが見つかりませんでした。")
            except Exception as e:
                logger.error(f"アクション抽出中にエラーが発生しました: {e}")
        raise ValueError("期待する形式のレスポンスが得られませんでした。")


    def _is_used_weather_info(self, schedule):
        '''
        ユーザーの予定を見て、天気情報が必要かを判定する
        '''
        return True

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

    def weather_feedback(self, schedule):
        '''
        ユーザーの予定を受け取り、行動を抽出するAPI
        input : schedule(str)
        output : response(dict)
        '''
        is_used = self._is_used_weather_info(schedule)
        response = {"is_used": is_used}
        if is_used:
            weather_info = self._get_weather_info()
            response["face"] = 0
            response["action"] = "天気情報"
            response["feedback"] = weather_info
            return response
        else:
            return response
            

    def _get_facescore(self, action):
        '''
        行動から危険度を考える（危険度が高い順に2, 1, 0で返す）
        input : action(str) : 行動
        output : int : 感情の番号
        '''
        prompt_face = (
            f"{action}の最中に危険が起こる一般的な確率を評価してください。"
            "評価結果を以下の数値のどれか1つで示してください: "
            "2は危険度が高い、1は中程度、0は低い。"
            "回答は必ず数値のみで「0」「1」「2」のいずれかを返してください。"
        )

        while True:
            # プロンプトの応答取得
            face = self.model.generate_content(prompt_face).text.strip()

            # 正規表現で数値判定
            if re.fullmatch("[0-2]", face):
                print(face)
                break
            else:
                print(f"不正な応答 '{face}' が返されました。再試行します。")
        
        return int(face)

    def _get_action_feedback(self, action):
        '''
        行動からフィードバックを生成する
        input : action(str) : 行動
        output : str : フィードバック
        '''
        prompt_description = (
            f"{action}の気をつけた方が良いポイントをおばあちゃん口調で60字以内で教えてください。"
        )
        for _ in range(5):
            try:
                feedback = self.model.generate_content(prompt_description).text
                break
            except Exception as e:
                print(f"おばあが怒っています: {e}")
        return feedback
        
    def action_feedback(self, action):
        '''
        ユーザーの行動データを受け取り、行動を抽出するAPI
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