# バックエンドの実行環境作成
0. .envファイルを作成する
```
GeminiAPI_KEY = GeminiAPIのAPI_Key
GOOLAB_APP_ID = gooラボapiのapp_id
SECRET_KEY = "適当な文字列"
SQLALCHEMY_DATABASE_URI= "mysql+pymysql://ユーザー名:パスワード@localhost/使用するデータベース名"
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
3. Google calendar apiを使用するためのcredentials.jsonを/backend/app/google_calendar_api上に配置する
このurlを参考に同じディレクトリにcredentials.jsonを配置する(名前を変更する必要あり)  
[GoogleカレンダーにPythonから予定を追加・編集してみた](https://dev.classmethod.jp/articles/google-calendar-api-create-schedule/)  

4. MySQLに入っての操作
```
mysql -u root -p
CREATE DATABASE your_database_name;
```
5. .envファイルの編集
```
SQLALCHEMY_DATABASE_URI= "mysql+pymysql://ユーザー名:パスワード@localhost/使用するデータベース"
```
6. データベースのマイグレーション
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
7. 実行  
./backendのディレクトリで
```
flask run
```