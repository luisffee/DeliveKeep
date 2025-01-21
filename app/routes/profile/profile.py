from flask import Blueprint, request, jsonify, url_for, redirect, render_template
from ..auth.models import User
from ...db import db
from ..auth.auth import token_required

from .models import Adresses, Payments, Atendimentos
from ..deliveries.models import Delivery

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
    
@profile_bp.route('/getAdresses', methods=['GET'])
@token_required
def getAdresses(current_user):
    if request.method == 'GET':
        user_id = current_user.id
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        adresses = Adresses.query.filter_by(user_id=user_id).all()
        return jsonify({'adresses': [address.serialize() for address in adresses]}), 200
    
@profile_bp.route('/addPayment', methods=['POST'])
@token_required
def addPayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        titulo = data.get('titulo')
        numeroCartao = data.get('numeroCartao')
        nomeTitular = data.get('nomeTitular')
        validade = data.get('validade')
        cvv = data.get('cvv')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        new_payment = Payments(user_id=user_id, titulo=titulo, numeroCartao=numeroCartao, nomeTitular=nomeTitular, validade=validade, cvv=cvv)
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({'message': 'Payment added successfully', 'status':'200'}), 200
    
@profile_bp.route('/deletePayment', methods=['POST'])
@token_required
def deletePayment(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        titulo = data.get('titulo')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        payment = Payments.query.filter_by(titulo=titulo).first()
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted successfully', 'status':'200'}), 200

@profile_bp.route('/getPayments', methods=['GET'])
@token_required
def getPayments(current_user):
    if request.method == 'GET':
        user_id = current_user.id
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        payments = Payments.query.filter_by(user_id=user_id).all()
        return jsonify({'payments': [payment.serialize() for payment in payments]}), 200
    
@profile_bp.route('/addAtendimento', methods=['POST'])
@token_required
def addAtendimento(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        assunto = data.get('assunto')
        email = data.get('email')
        codigoRastreio = data.get('codigoRastreio')
        telefone = data.get('telefone')
        descricao = data.get('descricao')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        if codigoRastreio:
            delivery = Delivery.query.filter_by(rastreio=codigoRastreio).first()
            if not delivery:
                return jsonify({'message': 'Delivery not found'}), 404
        new_atendimento = Atendimentos(user_id=user_id, assunto=assunto, email=email, codigoRastreio=codigoRastreio, telefone=telefone, descricao=descricao)
        db.session.add(new_atendimento)
        db.session.commit()
        return jsonify({'message': 'Atendimento added successfully', 'status':'200'}), 200
    
@profile_bp.route('/getAtendimentos', methods=['GET'])
@token_required
def getAtendimentos(current_user):
    if request.method == 'GET':
        user_id = current_user.id
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        atendimentos = Atendimentos.query.filter_by(user_id=user_id).all()
        return jsonify({'atendimentos': [atendimento.serialize() for atendimento in atendimentos]}), 200