from ...db import db

class Adresses(db.Model):
    __tablename__ = 'adresses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    titulo = db.Column(db.String(255), nullable=False, unique=True)
    rua = db.Column(db.String(255), nullable=False)
    number = db.Column(db.String(10), nullable=False)
    bairro = db.Column(db.String(255), nullable=False)
    cep = db.Column(db.String(8), nullable=False)
    distance = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.Date)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'titulo': self.titulo,
            'rua': self.rua,
            'number': self.number,
            'bairro': self.bairro,
            'cep': self.cep,
            'distance': self.distance,
            'created_at': self.created_at
        }
    
class Payments(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    titulo = db.Column(db.String(255), nullable=False)
    numeroCartao = db.Column(db.String(19), nullable=False)
    nomeTitular = db.Column(db.String(255), nullable=False)
    validade = db.Column(db.String(5), nullable=False)
    cvv = db.Column(db.String(3), nullable=False)
    created_at = db.Column(db.Date)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'card_name': self.titulo,
            'card_number': self.numeroCartao,
            'card_holder': self.nomeTitular,
            'expiration_date': self.validade,
            'cvv': self.cvv,
            'created_at': self.created_at
        }