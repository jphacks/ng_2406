import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'hard-to-guess-string'
