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
        user_id = data.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user.name = data.get('name')
        user.email = data.get('email')
        user.address = data.get('address')
        user.numberContact = data.get('numberContact')
        user.date_of_birth = data.get('date_of_birth')
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200

@profile_bp.route('/addAdress', methods=['POST'])
@token_required
def addAdress(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        address = data.get('address')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        new_address = Adresses(user_id=user_id, address=address)
        db.session.add(new_address)
        db.session.commit()
        return jsonify({'message': 'Address added successfully'}), 200

@profile_bp.route('/deleteAdress', methods=['POST'])
@token_required
def deleteAdress(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        address_id = data.get('address_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        address = Adresses.query.filter_by(id=address_id).first()
        if not address:
            return jsonify({'message': 'Address not found'}), 404
        db.session.delete(address)
        db.session.commit()
        return jsonify({'message': 'Address deleted successfully'}), 200
    
@profile_bp.route('/addPayment', methods=['POST'])
@token_required
def addPayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
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
        return jsonify({'message': 'Payment added successfully'}), 200
    
@profile_bp.route('/deletePayment', methods=['POST'])
@token_required
def deletePayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        payment_id = data.get('payment_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        payment = Payments.query.filter_by(id=payment_id).first()
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted successfully'}), 200