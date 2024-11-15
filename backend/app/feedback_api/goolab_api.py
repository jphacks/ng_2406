from dotenv import load_dotenv
import os
import json
import requests


class GoolabAPI:
    def __init__(self):
        load_dotenv()
        self.app_id = os.getenv('GOOLAB_APP_ID')

    def has_action_content(self, sentence):
        if len(sentence) <= 1:
            return False

        headers = {'Content-Type': 'application/json'}
        url = 'https://labs.goo.ne.jp/api/morph'

        parameters = {
            "app_id": self.app_id,
            "sentence": sentence,
            "pos_filter": "動詞語幹|動詞活用語尾|動詞接尾辞"
        }

        # リクエスト送信
        res = requests.post(url, headers=headers, data=json.dumps(parameters)).json()
        word_list = res['word_list']
        print(res)
        if len(word_list[0]) == 0:
            return False
        return True

    def _calculate_similarity(self, text1, text2):
        headers = {'Content-Type': 'application/json'}
        url = 'https://labs.goo.ne.jp/api/textpair'

        parameters = {
            "app_id": self.app_id,
            "text1": text1,
            "text2": text2
        }

        # リクエスト送信
        res = requests.post(url, headers=headers, data=json.dumps(parameters)).json()
        similarity = res['score']
        return similarity
    
    def calculate_risk_level(self, action):
        risk_check = []
        risk_check.append(self._calculate_similarity(action, "犯罪"))
        risk_check.append(self._calculate_similarity(action, "違反"))
        risk_check.append(self._calculate_similarity(action, "事件"))
        sorted_risk_check = sorted(risk_check, reverse=True)
        weighted_risk = sorted_risk_check[0] * 0.8 + sorted_risk_check[1] * 0.2
        return weighted_risk
