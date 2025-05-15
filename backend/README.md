# バックエンドの実行環境作成
0. .envファイルを作成する
```
GeminiAPI_KEY = GeminiAPIのAPI_Key
SECRET_KEY = "適当な文字列"
SQLALCHEMY_DATABASE_URI= "postgresql+psycopg2://ユーザー名:パスワード@localhost/使用するデータベース名"
JWT_SECRET_KEY = "適当な文字列"
```

1. 仮想環境の作成と有効化
```
python -m venv venv
.\venv\Script\activate
```
2. pipのinstall
```
pip install -r requirements.txt
```
5. MySQLに入っての操作
```
mysql -u root -p
CREATE DATABASE your_database_name;
```
6. .envファイルの編集
```
SQLALCHEMY_DATABASE_URI= "mysql+pymysql://ユーザー名:パスワード@localhost/使用するデータベース"
```
7. データベースのマイグレーション
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
8. 実行  
./backendのディレクトリで
```
flask run
```