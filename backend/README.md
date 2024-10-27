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
3. MySQLに入っての操作
```
mysql -u root -p
CREATE DATABASE your_database_name;
```
4. .envファイルの編集
```
SQLALCHEMY_DATABASE_URI= "mysql+pymysql://ユーザー名:パスワード@localhost/使用するデータベース"
```
5. データベースのマイグレーション
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
6. 実行  
./backendのディレクトリで
```
flask run
```