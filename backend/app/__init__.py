from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    # CORSの設定
    CORS(app)

    # コンフィグをロード
    app.config.from_object('config.Config')

    # JWTの初期化
    # jwt = JWTManager(app)

    # ルーティングを登録
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
