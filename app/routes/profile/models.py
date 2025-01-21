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
    
class Payments(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_name = db.Column(db.String(255), nullable=False)
    card_number = db.Column(db.String(16), nullable=False)
    card_holder = db.Column(db.String(255), nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    cvv = db.Column(db.String(3), nullable=False)
    created_at = db.Column(db.Date)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'card_name': self.card_name,
            'card_number': self.card_number,
            'card_holder': self.card_holder,
            'expiration_date': self.expiration_date,
            'cvv': self.cvv,
            'created_at': self.created_at
        }