class Dog:
    def __init__(self):
        pass

    def weather_feedback(self, weather_data):
        '''
        天気情報に対するフィードバックを生成するためのプロンプトを返す
        input(str) : weather_data
        output(str) : feedback
        '''
        prompt = (weather_data + "ここから本日の天気情報を取り出し、注意すべきレベルに応じて忠告するように30字以内で「ワン」と「!」のみの文字列を返してください")
        return prompt

    def action_feedback(self, action):
        '''
        行動に対するフィードバックを生成するためのプロンプトを返す
        input(str) : action
        output(str) : feedback
        '''
        prompt = (
            f"{action}の危険さに応じて忠告するように「ワン」と「!」のみで40字以内の文字列を返してください。"
        )
        return prompt
    
    def error_message(self):
        '''
        エラーが起きた時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "ワン？"
        return prompt

    def error_weather(self):
        '''
        天気情報の取得に失敗した時に返すメッセージ
        input : None
        output : str : 怒っているメッセージ
        '''
        prompt = "ワンワン！"
        return prompt