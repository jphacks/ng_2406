import os
from dotenv import load_dotenv

class Config:
    load_dotenv()
    SECRET_KEY = os.getenv('SECRET_KEY') or 'hard-to-guess-string'
