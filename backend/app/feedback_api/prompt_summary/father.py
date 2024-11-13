class Father:
    def __init__(self):
        pass

    def weather_feedback(self, weather_data):
        '''
        天気情報に対するフィードバックを生成するためのプロンプトを返す
        input(str) : weather_data
        output(str) : feedback
        '''
        prompt = (weather_data + "ここから本日の天気情報を取り出し、親父口調で30字以内のアドバイスをください")
        return prompt

    def action_feedback(self, action):
        '''
        行動に対するフィードバックを生成するためのプロンプトを返す
        input(str) : action
        output(str) : feedback
        '''
        prompt = (
            f"{action}の危険につながりそうなポイントを親父口調で60字以内で警告してください。"
        )
        return prompt
    
    def error_message(self):
        '''
        エラーが起きた時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "おい。変なことしようとしてるんじゃないだろうな。マジメに生きろよ。"
        return prompt

    def error_weather(self):
        '''
        天気情報の取得に失敗した時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "天気情報なんか信じるな。窓の外見てこい。"
        return prompt