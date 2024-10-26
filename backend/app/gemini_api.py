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
        GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

        # APIキーの設定
        genai.configure(api_key=GOOGLE_API_KEY)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.weather = WeatherAPI()
    
    def generate_content(self, data_action):
        # 天気情報の取得
        weather_data = self.get_wether_data()
        # ユーザーからの情報をもとにフィードバックを作成
        prompt = self.generate_prompt(data_action)
        actions = self.action_extract(prompt)
        responce = self.action_response(actions, weather_data)
        return responce

    def get_wether_data(self):
        nagoya_city_number = 230010
        weather_data = self.weather.get_weather(nagoya_city_number)
        prompt = (weather_data + "ここから天気の情報を取り出し、20字以内のアドバイスをください")
        weather_data = self.model.generate_content(prompt).text
        return weather_data

    def generate_prompt(self, data_action):
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

            # 正規表現で ```で囲まれた部分とその中の配列部分を抽出
            code_block_pattern = r"```(.+?)```"  # ```で囲まれた部分を取得
            array_pattern = r"\[([^\]]+)\]"     # []で囲まれた配列部分を取得

            # ```で囲まれたコードブロックを検索
            code_block_match = re.search(code_block_pattern, feedback, re.DOTALL)
            if code_block_match:
                # コードブロック内から配列部分を抽出
                array_match = re.search(array_pattern, code_block_match.group(1))
                if array_match:
                    # 配列部分をPythonリストに変換
                    actions = [action.strip().strip('"') for action in array_match.group(1).split(",")]
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
        responce = {'data' : []}
        responce['data'].append({
            'face': 2,
            'title': '天気情報',
            'description': weather_data.strip()
        })
        for action in actions:
            responce['data'].append({
                'face': 1,
                'title': action,
                'description': 'AIからの注意'
            })
        return responce