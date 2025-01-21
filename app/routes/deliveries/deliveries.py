from flask import Blueprint, request, jsonify, url_for, redirect, render_template, send_file
from .models import Delivery
from ...db import db
from ..auth.auth import token_required
import qrcode
import io

delivery_bp = Blueprint('delivery', __name__)

@delivery_bp.route('/getProdutos', methods=['GET'])
@token_required
def getProdutos(current_user):
    deliveries = []
    if request.method == 'GET':
        user_id = current_user.id
        user_deliveries = Delivery.query.filter_by(user_id=user_id).all()
        for delivery in user_deliveries:
            deliveries.append(delivery.serialize())
        return jsonify({'produtos': deliveries}), 200

@delivery_bp.route('/addProduto', methods=['POST'])
@token_required
def addProduto(current_user):
    if request.method == 'POST':
        data = request.get_json()
        user_id = current_user.id
        nomeProduto = data.get('nomeProduto')
        descricao = data.get('descricao')
        email = data.get('email')
        telefone = data.get('telefone')
        rastreio = data.get('rastreio')
        new_delivery = Delivery(user_id=user_id, nomeProduto=nomeProduto, descricao=descricao, email=email, telefone=telefone, rastreio=rastreio)
        db.session.add(new_delivery)
        db.session.commit()
        return jsonify({'message': 'Produto criado com sucesso!', 'status':'200'}), 200