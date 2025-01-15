from flask import Blueprint, request, jsonify, url_for, redirect, render_template, session
from functools import wraps
from werkzeug.security import check_password_hash
from .models import User
from ...db import db
import jwt
import datetime
import os


auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!', 'status': '401'}), 401
        
        try:
            data = jwt.decode(token.split(" ")[1], os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!', 'status': '401'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def is_cpf(document):
    # Add validation logic for CPF (typically 11 digits)
    return len(document) == 11

@auth_bp.route('/registerUser', methods=['GET', 'POST'])
def registerUser():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')
    cpf = data.get('cpf')
    address = data.get('address')
    date_of_birth = data.get('date_of_birth')
    numberContact = data.get('numberContact')

    # Validar entrada
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'User already exists', 'status': '401'}), 401
    elif len(email) < 4:
        return jsonify({'message': 'Email must be greater than 3 characters.', 'status': '401'}), 401
    elif len(name) < 2:
        return jsonify({'message': 'Name must be greater than 1 character.', 'status': '401'}), 401
    elif password1 != password2:
        return jsonify({'message': 'Passwords don\'t match.', 'status': '401'}), 401

    # Criar novo usuário
    new_user = User(name=name, email=email, password=password1, cpf=cpf, address=address, date_of_birth=date_of_birth, numberContact=numberContact)
    db.session.add(new_user)
    db.session.flush()  # Obter ID do usuário sem fazer commit ainda
    
    # Commit das mudanças
    db.session.commit()
    
    return jsonify({'message': 'User created successfully', 'status': '200'}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, os.environ.get('SECRET_KEY'), algorithm='HS256')
        
        return jsonify({'message': 'Logged in successfully', 'token': token, 'user_name': user.name, 'status': '200'}), 200
    else:
        return jsonify({'message': 'Invalid email or password', 'status': '401'}), 401

@auth_bp.route('/userInfo', methods=['GET'])
@token_required
def userInfo(current_user):
    info = request.args.get('info')
    if not info:
        return jsonify({'message': 'Info parameter is missing', 'status': '400'}), 400
    
    user_info = getattr(current_user, info, None)
    if user_info is None:
        return jsonify({'message': 'Invalid info parameter', 'status': '400'}), 400
    
    return jsonify({'message': 'Logged in successfully', 'user_info': user_info, 'status': '200'}), 200
