from flask_cors import CORS
from flask import Blueprint, request, jsonify
from .models import Diary, Feedback, db
from . import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from app.gemini_api import GeminiAPI
from app.google_calendar_api.calendar_api import CalendarAPI
import random
import string
from hashids import Hashids


YOUR_GOOGLE_CLIENT_ID = "your-google-client-id"


api = Blueprint('api', __name__)
gemini = GeminiAPI()
calendar = CalendarAPI()

# Google認証トークンを確認し、JWTを返すエンドポイント
@app.route('/auth/google', methods=['POST'])
def auth_google():
    data = request.get_json()
    token_id = data.get("tokenId")

    try:
        # Googleのトークンを検証
        idinfo = id_token.verify_oauth2_token(token_id, requests.Request(), YOUR_GOOGLE_CLIENT_ID)
        
        # トークンが有効であればユーザーIDやメールアドレスを取得
        user_id = idinfo["sub"]
        email = idinfo["email"]

        # JWTを発行
        access_token = create_access_token(identity={"user_id": user_id, "email": email})
        return jsonify(access_token=access_token), 200
    except ValueError:
        # トークンが無効な場合
        return jsonify({"message": "Invalid token"}), 401

# 認証が必要なエンドポイント
@app.route('/protected-endpoint', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

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
@jwt_required()  # JWT認証が必要
def extract_actions_from_calendar():
    try:
        # JWTトークンからユーザー情報を取得
        current_user = get_jwt_identity()
        user_id = current_user["user_id"]  # JWTから取得したuser_idを使用

        # Google OAuth 2.0用の認証情報を取得するためにリクエストを送信
        # リクエストにはGoogle APIからのアクセストークンが必要です
        google_token = current_user.get("google_token")  # これはJWTに保存されたGoogleのアクセストークン

        if not google_token:
            return jsonify({"message": "Google authentication required"}), 401

        # Googleのアクセストークンを検証
        idinfo = id_token.verify_oauth2_token(google_token, Request(), YOUR_GOOGLE_CLIENT_ID)
        
        # Google APIの認証情報を作成
        creds = id_token.credentials_from_token(google_token)

        # カレンダーの予定を取得
        events = get_events(creds)
        return jsonify(events=events), 200

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
@jwt_required()  # JWT認証が必要
def add_feedback_to_calendar():
    try:
        # JWTからユーザー情報を取得
        current_user = get_jwt_identity()
        user_id = current_user["user_id"]  # JWTから取得したuser_idを使用

        # リクエストボディからイベント情報を取得
        request_data = request.get_json()
        events = request_data.get('events')

        if not events:
            return jsonify({'message': 'No events provided'}), 400
        
        # Googleアクセストークンの取得（もしJWT内に保存されている場合）
        google_token = current_user.get("google_token")
        
        if not google_token:
            return jsonify({"message": "Google authentication required"}), 401
        
        # Google API認証
        idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), YOUR_GOOGLE_CLIENT_ID)
        
        # Googleの認証情報を使用して、カレンダーにフィードバックを追加
        creds = id_token.credentials_from_token(google_token)
        calendar.add_feedback_to_event(events, creds)

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
