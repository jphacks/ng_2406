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

    def generate_content(self, data_action):
        '''
        ユーザーからの情報をもとにフィードバックを作成
        input(str) : data_action
        output(dict) : response
        '''
        # 天気情報の取得
        weather_data = self.get_wether_data()
        # ユーザーからの情報をもとにフィードバックを作成
        prompt = self.generate_prompt(data_action)
        actions = self.action_extract(prompt)
        response = self.action_response(actions, weather_data)
        return response

    def get_wether_data(self):
        '''
        天気情報を取得する
        input : None
        output : str : 天気情報
        '''
        nagoya_city_number = 230010
        weather_data = self.weather.get_weather(nagoya_city_number)
        prompt = (weather_data + "ここから本日の天気情報を取り出し、おばあちゃん口調で30字以内のアドバイスをください")
        weather_data = self.model.generate_content(prompt).text
        return weather_data

    def generate_prompt(self, data_action):
        '''
        ユーザーが入力した内容から行動を抜き出すためのプロンプトを作成
        input(str) : data_action
        output(str) : prompt
        '''
        prompt_action = data_action
        prompt = (prompt_action
                  + "という文章から行動を抜き出してpythonの配列として出力してください。")
        return prompt

    def action_extract(self, prompt):
        '''
        ユーザーが入力した内容から
        行動を抜き出して配列にする
        input(str) : prompt
        output(list[str]) : actions
        '''
        while True:
            feedback = self.model.generate_content(prompt).text
            print(feedback)

            # 正規表現で ```で囲まれた部分とその中の配列部分を抽出
            code_block_pattern = r"```(.+?)```"  # ```で囲まれた部分を取得
            array_pattern = r"\[([^\]]+)\]"     # []で囲まれた配列部分を取得

            # ```で囲まれたコードブロックを検索
            code_block_match = re.search(
                code_block_pattern, feedback, re.DOTALL)
            if code_block_match:
                # コードブロック内から配列部分を抽出
                array_match = re.search(
                    array_pattern, code_block_match.group(1))
                if array_match:
                    # 配列部分をPythonリストに変換
                    actions = [action.strip().strip('"')
                               for action in array_match.group(1).split(",")]
                    print(actions)
                    break
                else:
                    print("配列が見つかりませんでした。", file=sys.stderr)
            else:
                print("コードブロックが見つかりませんでした。", file=sys.stderr)
        return actions

    def action_response(self, actions, weather_data):
        '''
        各イベントごとに処理を行う
        input: actions(list[str]) : ユーザーが入力した行動, weather_data(str) : 天気情報
        output(dict) : response
        '''
        response = {'data': []}
        response['data'].append({
            'face': 3,
            'title': '天気情報',
            'description': weather_data
        })
        for action in actions:
            prompt_description = action + "の気をつけた方が良いポイントをおばあちゃん口調で60字以内で教えてください。"
            description = self.model.generate_content(prompt_description).text
            face = self._get_facescore(action)
            response['data'].append({
                'face': face,
                'title': action,
                'description': description
            })
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
