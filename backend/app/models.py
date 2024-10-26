from . import db, bcrypt
from datetime import datetime

    
class Diary(db.Model):
    __tablename__ = 'diary'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime)
    action = db.Column(db.Text)
    

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diary_id = db.Column(db.Integer, db.ForeignKey('diary.id'), nullable=False)
    face = db.Column(db.Integer, nullable=False)
    title = db.Column(db.Text)
    description = db.Column(db.Text)