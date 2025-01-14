from ...db import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(18), unique=True, nullable=False)
    name = db.Column(db.String(16), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    numberContact = db.Column(db.String(11), nullable=False)
    password = db.Column(db.String(40), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.Date)