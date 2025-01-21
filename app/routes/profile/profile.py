from flask import Blueprint, request, jsonify, url_for, redirect, render_template
from ..auth.models import User
from ...db import db
from ..auth.auth import token_required

from .models import Adresses, Payments

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    if request.method == 'GET':
        user = User.query.filter_by(id=current_user.id).first()
        if not user:
            return jsonify({'message': 'User not found'}),
        return jsonify({'user': user.serialize()}), 200
    
@profile_bp.route('/editProfile', methods=['POST'])
@token_required
def editProfile(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user.name = data.get('name')
        user.email = data.get('email')
        user.address = data.get('address')
        user.numberContact = data.get('numberContact')
        user.date_of_birth = data.get('date_of_birth')
        db.session.commit()
        return jsonify({'message': 'User updated successfully', 'status':'200'}), 200

@profile_bp.route('/addAdress', methods=['POST'])
@token_required
def addAdress(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        titulo = data.get('titulo')
        rua = data.get('rua')
        number = data.get('number')
        bairro = data.get('bairro')
        cep = data.get('cep')
        distance = data.get('distance')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        new_address = Adresses(user_id=user_id, titulo=titulo, rua=rua, number=number, bairro=bairro, cep=cep, distance=distance)
        db.session.add(new_address)
        db.session.commit()
        return jsonify({'message': 'Address added successfully', 'status':'200'}), 200

@profile_bp.route('/deleteAdress', methods=['POST'])
@token_required
def deleteAdress(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        titulo = data.get('titulo')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        address = Adresses.query.filter_by(titulo=titulo).first()
        if not address:
            return jsonify({'message': 'Address not found'}), 404
        db.session.delete(address)
        db.session.commit()
        return jsonify({'message': 'Address deleted successfully', 'status':'200'}), 200
    
@profile_bp.route('/addPayment', methods=['POST'])
@token_required
def addPayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        card_name = data.get('card_name')
        card_number = data.get('card_number')
        card_holder = data.get('card_holder')
        expiration_date = data.get('expiration_date')
        cvv = data.get('cvv')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        new_payment = Payments(user_id=user_id, card_name=card_name, card_number=card_number, card_holder=card_holder, expiration_date=expiration_date, cvv=cvv)
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({'message': 'Payment added successfully', 'status':'200'}), 200
    
@profile_bp.route('/deletePayment', methods=['POST'])
@token_required
def deletePayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        payment_id = data.get('payment_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        payment = Payments.query.filter_by(id=payment_id).first()
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted successfully', 'status':'200'}), 200