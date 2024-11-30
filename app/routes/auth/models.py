from ...db import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    document_number = db.Column(db.String(18), unique=True, nullable=False)
    username = db.Column(db.String(16), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(40), nullable=False)
    created_at = db.Column(db.Date)
    user_cpf = db.relationship("UserCPF", uselist=False, back_populates="user")
    user_cnpj = db.relationship("UserCNPJ", uselist=False, back_populates="user")

class UserCPF(db.Model):
    __tablename__ = 'users_cpf'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    user = db.relationship("User", back_populates="user_cpf")
    
class UserCNPJ(db.Model):
    __tablename__ = 'users_cnpj'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    company_name = db.Column(db.String(255), nullable=False)
    date_of_foundation = db.Column(db.Date, nullable=False)
    user = db.relationship("User", back_populates="user_cnpj")