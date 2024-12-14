from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import database_exists, create_database

db = SQLAlchemy()
engine = db.create_engine(f'postgresql://postgres:postgres@localhost:5432/delivekeep')

class InitDB():
    def __init__(self, app):
        self.app = app
        self.db = db
        self.engine = engine
    
    def createTables(self):
        with self.app.app_context():
            db.create_all()
        
    def start(self):
        self.db.init_app(self.app)
        if not database_exists(self.engine.url): create_database(self.engine.url)
        return self.db