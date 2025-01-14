from ...db import db

class Delivery(db.Model):
    __tablename__ = 'delivery'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    delivery_address = db.Column(db.String(255), nullable=False)
    delivery_arrival_date = db.Column(db.Date, nullable=True)
    delivery_status = db.Column(db.String(16), nullable=True)
    delivery_type = db.Column(db.String(16), nullable=False)
