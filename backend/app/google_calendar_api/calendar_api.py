from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from datetime import datetime, timezone, timedelta
from google.oauth2 import id_token
from dotenv import load_dotenv
import os

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")

class CalendarAPI:
    def __init__(self):
        pass

    def get_events(self, id_token):
        idinfo = id_token.verify_oauth2_token(id_token, Request(), CLIENT_ID)
        user_id = idinfo['sub']
        refresh_token = get_refresh_token_from_database(user_id)
        creds = Credentials.from_authorized_user_file(
            None,
            ['https://www.googleapis.com/auth/calendar.readonly']
        )
        creds.refresh(requests.Request())
        service = build('calendar', 'v3', credentials=creds)


        # タイムゾーン対応の現在の時刻を取得
        now_utc = datetime.now(timezone.utc)
        now_jst = now_utc.astimezone(timezone(timedelta(hours=9)))

        # 今日のイベントを取得する時間範囲を設定（JSTの0時から23時59分まで）
        time_start = now_jst.replace(hour=0, minute=0, second=0, microsecond=0)
        time_end = now_jst.replace(hour=23, minute=59, second=59, microsecond=999999)

        # ISOフォーマットに変換し、タイムゾーンオフセットを含める
        time_start_str = time_start.isoformat()
        time_end_str = time_end.isoformat()

        # イベントを取得
        events_result = service.events().list(
            calendarId='primary',
            timeMin=time_start_str,
            timeMax=time_end_str,
            singleEvents=True,
            orderBy='startTime'
        ).execute()

        events = events_result.get('items', [])
        event_list = []

        for event in events:
            # イベント情報をリストに追加
            action = event.get('summary', None)
            if action is None:
                continue
            event_info = {
                'event_id': event['id'],
                'action': action
            }
            event_list.append(event_info)

        response = {'event_list': event_list}
        return response

    def add_feedback_to_event(self, access_token, feedbacks):
        '''
        カレンダーにフィードバックを追加する
        '''
        creds = Credentials(token=access_token)
        service = build('calendar', 'v3', credentials=creds)
        for feedback in feedbacks:
            event_id = feedback['event_id']
            feedback_text = feedback['feedback']

            service.events().patch(
                calendarId='primary',
                eventId=event_id,
                body={
                    'description': feedback_text
                }
            ).execute()
        return True