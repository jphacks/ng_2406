from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from datetime import datetime, timedelta
import os.path
import pickle

class CalendarAPI:
    def __init__(self):
        scopes = ['https://www.googleapis.com/auth/calendar']
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', scopes)
        creds = self.get_tokens(scopes, flow)
        self.service = build('calendar', 'v3', credentials=creds)

    def get_tokens(self, scopes, flow):
        creds = None
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', scopes)
            creds = flow.run_local_server()
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        return creds

    def get_events(self):
        now_utc = datetime.utcnow()
        now_jst = now_utc + timedelta(hours=9)
    
        # 1年前と1年後の日付を計算
        time_start = now_jst - timedelta(days=365)
        time_end = now_jst + timedelta(days=365)

        # ISOフォーマットに変換し、'Z'を追加
        time_start_str = time_start.isoformat() + 'Z'
        time_end_str = time_end.isoformat() + 'Z'

        # イベントを取得
        events_result = self.service.events().list(
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
            event_info = {
                'id': event['id'],
                'summary': event.get('summary', 'No Title'),
                'start': event['start'].get('dateTime', event['start'].get('date')),
                'end': event['end'].get('dateTime', event['end'].get('date')),
            }
            event_list.append(event_info)

        return event_list

    def add_event(self, event):
        # イベントをカレンダーに追加
        event_result = self.service.events().insert(calendarId='primary', body=event).execute()
        return event_result['id']

    def delete_event(self, event_id):
        # イベントを削除
        try:
            self.service.events().delete(calendarId='primary', eventId=event_id).execute()
            print(f"Event with ID {event_id} deleted.")
        except Exception as e:
            print(f"An error occurred: {e}")