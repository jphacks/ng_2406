from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from datetime import datetime, timezone, timedelta
import os.path
import pickle

class CalendarAPI:
    def __init__(self):
        scopes = ['https://www.googleapis.com/auth/calendar']
        credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
        flow = InstalledAppFlow.from_client_secrets_file(credentials_path, scopes)
        creds = self._get_tokens(scopes, flow)
        self.service = build('calendar', 'v3', credentials=creds)

    def _get_tokens(self, scopes, flow):
        creds = None
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
        token_path = os.path.join(os.path.dirname(__file__), 'token.pickle')
        if os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            flow = InstalledAppFlow.from_client_secrets_file(
                credentials_path, scopes)
            creds = flow.run_local_server()
            # Save the credentials for the next run
            with open(token_path, 'wb') as token:
                pickle.dump(creds, token)
        return creds

    def get_events(self):
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
        events_result = self.service.events().list(
            calendarId='primary',
            timeMin=time_start_str,
            timeMax=time_end_str,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        events = events_result.get('items', [])
        if events == []:
            return None
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

    def add_feedback_to_event(self, feedbacks):
        '''
        カレンダーにフィードバックを追加する
        '''
        for feedback in feedbacks:
            try:
                event_id = feedback['event_id']
                feedback_text = feedback['feedback']
                self.service.events().patch(
                    calendarId='primary',
                    eventId=event_id,
                    body={
                        'description': feedback_text
                    }
                ).execute()
            except Exception as e:
                print(str(e))
        return True