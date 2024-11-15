# バックエンドの実行環境作成
0. .envファイルを作成する
```
GeminiAPI_KEY = GeminiAPIのAPI_Key
GOOLAB_APP_ID = gooラボapiのapp_id
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
3. Google calendar apiの認証情報を取得する  
このurlを参考にcredentials.jsonを取得して(名前を変更する必要あり) /backend/app/google_calendar_api上に配置する
[GoogleカレンダーにPythonから予定を追加・編集してみた](https://dev.classmethod.jp/articles/google-calendar-api-create-schedule/)  
4. gooラボapiのapp_idを取得する  
このurlを参考にして[gooラボapiご利用の流れ](https://labs.goo.ne.jp/apiusage/)、gooラボapiのapp_idを取得して
.envファイルに書き込む

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