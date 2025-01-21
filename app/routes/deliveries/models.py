from ...db import db

class Delivery(db.Model):
    __tablename__ = 'delivery'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    nomeProduto = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(64), nullable=True)
    telefone = db.Column(db.String(16), nullable=False)
    rastreio = db.Column(db.String(32), nullable=False, unique=True)
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'nomeProduto': self.nomeProduto,
            'descricao': self.descricao,
            'email': self.email,
            'telefone': self.telefone,
            'rastreio': self.rastreio
        }
