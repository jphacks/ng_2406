from flask_cors import CORS
from flask import Blueprint, request, jsonify
from .models import Diary, Feedback, db
from . import bcrypt
from flask_jwt_extended import create_access_token, jwt_required

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
        return jsonify({'message': '処理が失敗しました'}), 400


# 日記一覧取得API
@api.route('/get_diaries', methods=['GET'])
def get_diaries_list():
    # データベースから全日記を取得し、IDの降順で並べ替える
    diaries = Diary.query.order_by(Diary.id.desc()).all()

    # 取得したデータをレスポンス用のリストに整形
    response_diaries = [
        {
            'id': diary.id,
            'date': diary.date.isoformat(),  # 日付をISO形式の文字列に変換
            'action': diary.action  # actionフィールドも含める場合
        }
        for diary in diaries
    ]

    # JSON形式でレスポンスを返す
    return jsonify({'diaries': response_diaries}), 200

@api.route('/get_feedbacks', methods=['POST'])
def get_feedbacks():
    try:
        data = request.get_json()
        diary_id = data.get('diary_id')

        diary = Diary.query.filter_by(id=diary_id).first()
        responce = {
            'id': diary.id,
            'date': diary.date.isoformat(),
            'action': diary.action,
            'data':[]
        }

        # Feedbackモデルからdiary_idに一致する行を取得
        feedbacks = Feedback.query.filter_by(diary_id=diary_id).order_by(Feedback.id).all()

        # 取得したフィードバックをリストに整形
        responce['data'] = [
            {
                'face': feedback.face,  # faceフィールド
                'title': feedback.title,  # titleフィールド
                'description': feedback.description,  # descriptionフィールド
            }
            for feedback in feedbacks
        ]

        # レスポンスを返す
        return jsonify({'feedbacks': response_feedbacks}), 200

    except Exception as e:
        return jsonify({'message': 'リクエストが不正です', 'error': str(e)}), 400
