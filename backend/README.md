# バックエンドの実行環境作成
1. 仮想環境の作成と有効化
```
python -m venv venv
.\venv\Script\activate
```
2. pipのinstall
```
pip install -r requirements.txt
```
3. .envファイルの編集
```
SQLALCHEMY_DATABASE_URI= "mysql+pymysql://ユーザー名:パスワード@localhost/使用するデータベース"
```
4. データベースのマイグレーション
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
5. 実行  
./backendのディレクトリで
```
flask run
```