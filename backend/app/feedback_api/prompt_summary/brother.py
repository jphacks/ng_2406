class Brother:
    def __init__(self):
        pass

    def weather_feedback(self, weather_data):
        '''
        天気情報に対するフィードバックを生成するためのプロンプトを返す
        input(str) : weather_data
        output(str) : feedback
        '''
        prompt = (weather_data + "ここから本日の天気情報を取り出し、キザなナルシスト口調(一人称は俺)で30字以内のアドバイスをください"
                "必ず文章の最後には句読点や?ではなく☆をつけてください。"
        )
        return prompt

    def action_feedback(self, action):
        '''
        行動に対するフィードバックを生成するためのプロンプトを返す
        input(str) : action
        output(str) : feedback
        '''
        prompt = (
            f"{action}の行動で、うっかりしがちなポイント(特に忘れ物)をキザなナルシスト口調(一人称は俺)で60字以内で教えてください。"
            "必ず文章の最後には句読点や?ではなく☆をつけてください。"
        )
        return prompt
    
    def error_message(self):
        '''
        エラーが起きた時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "変な気を起こしちゃダメだぜ☆俺様だけ見てれば良いのさ☆"
        return prompt

    def error_weather(self):
        '''
        天気情報の取得に失敗した時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "天気は読めないな☆ん？あぁ俺様は大丈夫だぜ☆水も滴るいい男だからな☆"
        return prompt