import requests
from datetime import datetime

def get_weather(city):
    try:
        url = f"https://weather.tsukumijima.net/api/forecast?city={city}"
        response  = requests.get(url)
        response.raise_for_status()


        data_json = response.json()
        return data_json
    
    except requests.exceptions.RequestException as e:
        return f"天気情報の取得に失敗しました: {e}"
        
    except KeyError as e:
        return f"予期しないデータ形式です: {e}"

city_number = 230010
result = get_weather(city_number)

import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
import sys

# 環境変数の読み込み
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# プロンプトの設定
prompt = (result["description"]["bodyText"] + "ここから天気の情報を取り出し、20字以内のアドバイスをください")

# APIキーの設定
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

weather = model.generate_content(prompt).text
print(weather)