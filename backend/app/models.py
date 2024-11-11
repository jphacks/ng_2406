from . import db, bcrypt
from datetime import datetime

    
class Diary(db.Model):
    __tablename__ = 'diary'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diary_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
    schedule = db.Column(db.Text)
    character = db.Column(db.Text)
    

class Feedback(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diary_id = db.Column(db.Integer, db.ForeignKey('diary.id', ondelete='CASCADE'), nullable=False)
    face = db.Column(db.Integer, nullable=False)
    action = db.Column(db.Text)
    action_feedback = db.Column(db.Text)