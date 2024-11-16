class Brother:
    def __init__(self):
        pass

    def weather_feedback(self, weather_data):
        '''
        天気情報に対するフィードバックを生成するためのプロンプトを返す
        input(str) : weather_data
        output(str) : feedback
        '''
        prompt = (weather_data + "ここから本日の天気情報を取り出し、キザなナルシスト口調で30字以内のアドバイスをください"
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
            f"若い男性で、キザでナルシストな口調を用いて、{action}に関連する忘れ物について注意する文章を作成してください。"
            "行動に必要な持ち物を例示しながら、忘れ物をしないよう促してください。"
            "必ず60文字以内で、文末には☆をつけてください。"
        )
        return prompt
    
    def error_message(self):
        '''
        エラーが起きた時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "なんでそんなちっぽけなことを聞くんだい☆"
        return prompt

    def error_weather(self):
        '''
        天気情報の取得に失敗した時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "俺は傘を持たない。雨が降って濡れたとしても水も滴るいい男ってな☆"
        return prompt