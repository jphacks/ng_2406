from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # コンフィグをロード
    app.config.from_object('config.Config')

    # 拡張機能を初期化
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)
    

    # ルーティングを登録
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app