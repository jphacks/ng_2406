from flask import Flask
from ng_2406.backend.app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ここでルートやモデルを登録

    return app
