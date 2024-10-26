from flask_cors import CORS
from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

# ユーザー登録エンドポイント
@api.route('/feedback', methods=['POST'])
def register():
    try:
        data = request.get_json()
        prompt = data.get('action')
        print(prompt)
        if prompt is None:
            return jsonify({'message': 'リクエストが不正です'}), 400
        test = {
            "data":
                [
                    {
                        "face": 1,
                        "title": "test",
                        "description": "test"
                    },
                    {
                        "face": 2,
                        "title": "file",
                        "description": "file"
                    }
                ]
            }
        return jsonify(test), 200
    except:
        return jsonify({'message': '処理が失敗しました'})