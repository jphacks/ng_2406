from flask_cors import CORS
from flask import Blueprint, request, jsonify
from .models import Diary, Feedback, db
from . import bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime
from app.gemini_api import GeminiAPI

api = Blueprint('api', __name__)
gemini = GeminiAPI()

# アドバイス生成API
@api.route('/feedback', methods=['POST'])
def register():
    try:
        data = request.get_json()
        data_action = data.get('action')
        if data_action is None:
            return jsonify({'message': 'リクエストが不正です'}), 400
        response = gemini.generate_content(data_action)
        # データベースへの登録
        ## Diaryテーブルへの登録
        time_now = datetime.utcnow()
        diary = Diary(
            date=time_now,
            action=data_action
        )
        db.session.add(diary)
        db.session.commit()
        diary_id = diary.id
        ## Feedbackテーブルへの登録
        for data in response['data']:
            feedback = Feedback(
                diary_id=diary_id,
                face=data['face'],
                title=data['title'],
                description=data['description'],
            )
            db.session.add(feedback)
        db.session.commit()
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# 日記一覧取得API
@api.route('/get_diaries', methods=['GET'])
def get_diaries_list():
    diaries = Diary.query.order_by(Diary.id.desc()).all()
    response_diaries = [
        {
            'id': diary.id,
            'date': diary.date.isoformat(),
            'action': diary.action
        }
        for diary in diaries
    ]
    return jsonify({'diaries': response_diaries}), 200


# フィードバック取得API
@api.route('/get_feedbacks', methods=['POST'])
def get_feedbacks():
    try:
        data = request.get_json()
        diary_id = data.get('diary_id')

        diary = Diary.query.filter_by(id=diary_id).first()
        if not diary:
            return jsonify({'message': '日記が見つかりませんでした'}), 404

        response = {
            'id': diary.id,
            'date': diary.date.isoformat(),
            'action': diary.action,
            'data': []
        }

        feedbacks = Feedback.query.filter_by(diary_id=diary_id).order_by(Feedback.id).all()
        response['data'] = [
            {
                'face': feedback.face,
                'title': feedback.title,
                'description': feedback.description,
            }
            for feedback in feedbacks
        ]

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': 'リクエストが不正です', 'error': str(e)}), 400


# データベーステーブルの内容をすべて削除するAPI
@api.route('/delete_data', methods=['DELETE'])
def delete_data():
    try:
        Feedback.query.delete()
        Diary.query.delete()
        db.session.commit()
        return jsonify({'message': 'データベースの全ての内容が削除されました'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': '削除に失敗しました', 'error': str(e)}), 400

# データベースに情報を登録するためのAPI
@api.route('/register_info', methods=['PUT'])
def register_info():
    try:
        # Diaryテーブルへの登録
        diary_info = Diary(
            action="今日は何をしたんですか？？",
            date=datetime.utcnow()
        )
        db.session.add(diary_info)
        db.session.commit()
        diary_id = diary_info.id

        feedback_info = {
            "data": [
                {
                    "diary_id": diary_id,
                    "face": 1,
                    "title": "test",
                    "description": "test"
                },
                {
                    "diary_id": diary_id,
                    "face": 2,
                    "title": "file",
                    "description": "file"
                }
            ]
        }

        for feedback in feedback_info["data"]:
            feed = Feedback(
                diary_id=feedback["diary_id"],
                face=feedback["face"],
                title=feedback["title"],
                description=feedback["description"]
            )
            db.session.add(feed)
        db.session.commit()

        return jsonify({'message': '処理が成功しました'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400
