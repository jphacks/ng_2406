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
        test = {"data":
                [
                    {
                        "face": 2,
                        "title": "交通事故",
                        "description": "朝早く出かけると、まだ暗い時間帯に運転することになるかもしれないわね。視界が悪い中での運転は事故のリスクが高まるから、特に注意が必要よ。"
                    },
                    {
                        "face": 1,
                        "title": "体調不良",
                        "description": "早起きして参加するとなると、睡眠不足になったり、朝ごはんを抜いたりすることがあるかもしれないわ。体調を崩すと、せっかくのイベントも楽しめなくなっちゃうから、しっかり食べて、体を温めておくのが大事よ。"
                    },
                    {
                        "face": 0,
                        "title": "人混みでのトラブル",
                        "description": "大きなイベントだから、参加者がたくさん集まるでしょうね。人混みでは迷子になったり、貴重品を失くしたりすることもあるから、周囲に気を配って行動することが大切よ。"
                    }
                ]
                }
        return jsonify(test), 200
    except:
        return jsonify({'message': '処理が失敗しました'})
