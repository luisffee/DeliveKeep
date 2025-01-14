from flask import Blueprint, request, jsonify, url_for, redirect, render_template, session
from werkzeug.security import check_password_hash
from .models import User
from ...db import db

auth_bp = Blueprint('auth', __name__)

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

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        session['user_id'] = user.id
        return jsonify({'message': 'Logged in successfully', 'status': '200'}), 200
    else:
        return jsonify({'message': 'Invalid email or password', 'status': '401'}), 401

@auth_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'})