import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
import sys

# 環境変数の読み込み
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# プロンプトの設定
prompt_action = "今日は朝起きて卵を食べて、名城大学に来て帰りました。"
prompt = (prompt_action
+ "という文章から行動を抜き出してpythonの配列として出力してください。")

# APIキーの設定
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

'''
ユーザーが入力した内容から
行動を抜き出して配列にする
input(str) : prompt
output(list[str]) : actions
'''
while True:
    feedback = model.generate_content(prompt).text

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

'''
各イベントごとに処理を行う
input(list[str]) : actions
output(dict) : response

APIエンドポイント
url : api/feedback
POSTメソッド
request : {
    'action': str
}
responseの内容について
{
    'data':{
        {
            'face': int(0-2の3段階),
            'title': str(行動の名前),
            'description': str(行動に対するAIからの注意),
        },
        {
            'face': int(0-2の3段階),
            'title': str(行動の名前),
            'description': str(行動に対するAIからの注意),
        }
    }
}
'''
responce = {'data' : []}
for action in actions:
    responce['data'].append({
        'face': 1,
        'title': action,
        'description': 'AIからの注意'
    })

print(responce)