from flask_cors import CORS
from flask import Blueprint, request, jsonify
from .models import Diary, Feedback, db
from . import bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime
from app.gemini_api import GeminiAPI
from app.google_calendar_api.calendar_api import CalendarAPI
import random
import string
from hashids import Hashids


api = Blueprint('api', __name__)
gemini = GeminiAPI()
calendar = CalendarAPI()


# diary idをURLに使用する10桁のハッシュ値に変換する
def hash_diary_id(diary_id):
    hashids = Hashids(salt="f84fSgda", min_length=10)
    diary_url = hashids.encode(diary_id)
    return diary_url


# ユーザーの予定から行動を抽出するAPI
@api.route('/extract-actions', methods=['POST'])
def extract_actions():
    try:
        request_data = request.get_json()
        schedule = request_data.get('schedule')

        actions = gemini.extract_actions(schedule)

        time_now = datetime.utcnow()
        diary = Diary(
            created_at=time_now,
            schedule=schedule
        )
        db.session.add(diary)
        db.session.commit()

        diary_id = diary.id
        diary_url = hash_diary_id(diary_id)
        diary.diary_url = diary_url

        db.session.commit()

        response = {
            "actions": actions,
            "diary_id": diary_id,
            "diary_url": diary_url
        }
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# Googleカレンダーの予定から行動を抽出するAPI
@api.route('/extract-actions-from-calendar', methods=['POST'])
def extract_actions_from_calendar():
    try:
        # 認証情報はフロントで取得される
        request_data = request.get_json()
        access_token = data.get('access_token')
        response = calendar.get_events(access_token)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# 天気に関するフィードバックを生成するAPI
@api.route('/weather-feedback', methods=['POST'])
def weather_feedback():
    try:
        request_data = request.get_json()
        schedule = request_data.get('schedule')
        character = request_data.get('character')
        diary_id = request_data.get('diary_id')

        response = gemini.weather_feedback(schedule)
        if response['is_used']:
            feedback = Feedback(
                diary_id=diary_id,
                face=response['face'],
                action=response['action'],
                action_feedback=response['feedback']
            )
            db.session.add(feedback)
            db.session.commit()
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# ユーザーの行動に対するフィードバックを生成するAPI
@api.route('/action-feedback', methods=['POST'])
def action_feedback():
    try:
        request_data = request.get_json()
        action = request_data.get('action')
        schedule = request_data.get('schedule')
        character = request_data.get('character')
        diary_id = request_data.get('diary_id')

        response = gemini.action_feedback(action)
        feedback = Feedback(
            diary_id=diary_id,
            face=response['face'],
            action=response['action'],
            action_feedback=response['feedback']
        )
        db.session.add(feedback)
        db.session.commit()
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# カレンダーにフィードバックを追加するAPI
@api.route('/add-feedback-to-calendar', methods=['PUT'])
def add_feedback_to_calendar():
    try:
        request_data = request.get_json()
        access_token = data.get('access_token')
        events = request_data.get('events')
        calendar.add_feedback_to_event(access_token, events)
        return jsonify({'message': "カレンダーへの登録に成功しました"}), 200
    except Exception as e:
        return jsonify({'message': '処理が失敗しました', 'error': str(e)}), 400


# 指定されたIDに対応する日記を取得するAPI
@api.route('/get/diary/<diary_url>', methods=['GET'])
def get_feedbacks(diary_url):
    try:
        diary = Diary.query.filter_by(diary_url=diary_url).first()
        if not diary:
            return jsonify({'message': '日記が見つかりませんでした'}), 404

        diary_id = diary.id
        response = {
            'created_at': diary.created_at.isoformat(),
            'schedule': diary.schedule,
            'actions': []
        }

        feedbacks = Feedback.query.filter_by(
            diary_id=diary_id).order_by(Feedback.id).all()
        response['actions'] = [
            {
                'face': feedback.face,
                'action': feedback.action,
                'feedback': feedback.action_feedback,
            }
            for feedback in feedbacks
        ]

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': 'リクエストが不正です', 'error': str(e)}), 400
