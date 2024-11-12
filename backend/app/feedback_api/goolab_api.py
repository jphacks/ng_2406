from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()
app_id = os.getenv('GOOLAB_APP_ID')

headers = {'Content-Type': 'application/json'}

parameters = {
    "app_id": app_id,
    "sentence": "高橋さんはアメリカに出張に行きました。"
}

# APIエンドポイント
url = 'https://labs.goo.ne.jp/api/morph'

# リクエスト送信
res = requests.post(url, headers=headers, data=json.dumps(parameters))
response = res.json()
print(response)