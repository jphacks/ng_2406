from flask import Flask, jsonify

def create_app():
    app = Flask(__name__)

    @app.route('/api/data')
    def get_data():
        return jsonify({"message": "FlaskからReactへのデータです"})

    return app
