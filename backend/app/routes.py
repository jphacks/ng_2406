from flask_cors import CORS
from flask import Blueprint, request, jsonify
from .models import Diary, Feedback, db
from . import bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime
from app.feedback_api.gemini_api import GeminiAPI
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
        if not request_data:
            return jsonify({'message': 'リクエストボディが空です'}), 400

        schedule = request_data.get('schedule')
        character = request_data.get('character')

        if schedule is None:
            return jsonify({'message': 'scheduleが指定されていません'}), 400

        if character is None:
            return jsonify({'message': 'characterが指定されていません'}), 400

        if not isinstance(character, int) or not (0 <= character <= 3):
            return jsonify({'message': 'characterは0から3の整数である必要があります'}), 400

        actions = gemini.extract_actions(schedule)
        actions = [action.strip("'") for action in actions]
        if actions is None:
            return jsonify({'message': '行動が見つかりませんでした'}), 400

        time_now = datetime.utcnow()
        diary = Diary(
            created_at=time_now,
            schedule=schedule,
            character=character
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
        print(str(e))
        return jsonify({'message': '処理が失敗しました'}), 400


# ユーザーの行動に対するフィードバックを生成するAPI
@api.route('/action-feedback', methods=['POST'])
def action_feedback():
    try:
        request_data = request.get_json()
        action = request_data.get('action')
        schedule = request_data.get('schedule')
        character = request_data.get('character')
        diary_id = request_data.get('diary_id')

        if action is None or character is None:
            return jsonify({'message': '必要なパラメータが不足しています'}), 400

        if not isinstance(character, int) or not (0 <= character <= 3):
            return jsonify({'message': 'キャラクターは0 ~ 3の間にしてください'}), 400

        response = gemini.action_feedback(action, character)
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
        print(str(e))
        return jsonify({'message': '処理が失敗しました'}), 400


# 指定されたIDに対応する日記を取得するAPI
@api.route('/get/diary/<diary_url>', methods=['GET'])
def get_feedbacks(diary_url):
    try:
        diary = Diary.query.filter_by(diary_url=diary_url).first()
        if not diary:
            return jsonify({'message': '日記が見つかりませんでした'}), 400

        diary_id = diary.id
        response = {
            'created_at': diary.created_at.isoformat(),
            'schedule': diary.schedule,
            'character': diary.character,
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
        print(str(e))
        return jsonify({'message': 'リクエストが不正です'}), 400


# カレンダーからユーザーの行動を抽出するAPI
@api.route('/get/calendar_events', methods=['GET'])
def get_calendar_events():
    try:
        response = calendar.get_events()
        if response is None:
            return jsonify({'message': '行動が見つかりませんでした'}), 400
        return jsonify(response), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': '処理が失敗しました'}), 400


# カレンダーのユーザーの行動に対するフィードバックを生成するAPI
@api.route('/calendar-event-feedback', methods=['POST'])
def calendar_event_feedback():
    try:
        request_data = request.get_json()
        action = request_data.get('action')
        character = request_data.get('character')

        if not (0 <= character <= 3):
            return jsonify({'message': 'キャラクターは0 ~ 3の間にしてください'}), 400

        response = gemini.calendar_action_feedback(action, character)
        return jsonify(response), 200

    except Exception as e:
        print(str(e))
        return jsonify({'message': '処理が失敗しました'}), 400


# カレンダーにフィードバックを追加するAPI
@api.route('/add-feedback-to-calendar', methods=['PUT'])
def add_feedback_to_calendar():
    try:
        request_data = request.get_json()
        events = request_data.get('events')
        calendar.add_feedback_to_event(events)
        return jsonify({'message': "カレンダーへの登録に成功しました"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': '処理が失敗しました'}), 400
