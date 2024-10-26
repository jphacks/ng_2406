import google.generativeai as genai
import os
from dotenv import load_dotenv

#　環境変数の読み込み
load_dotenv()
GOOGLE_API_KEY=os.getenv('GOOGLE_API_KEY')

prompt = "今日は朝起きて卵を食べて、名城大学に来て帰りました。という文章から行動を抜き出してpythonの配列として出力してください。"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
feedback = model.generate_content(prompt)
action = feedback.text
print(action)