import requests
from datetime import datetime


class WeatherAPI:
    def __init__(self):
        pass

    def get_weather(self, city):
        '''
        天気情報を取得するための関数
        input : city(int) : 都市の番号(名古屋だと230010)
        output : str : 天気情報
        '''
        try:
            url = f"https://weather.tsukumijima.net/api/forecast?city={city}"
            response = requests.get(url)
            response.raise_for_status()

            data_json = response.json()
            return data_json["description"]["bodyText"]

        except requests.exceptions.RequestException as e:
            return f"天気情報の取得に失敗しました: {e}"

        except KeyError as e:
            return f"予期しないデータ形式です: {e}"
