from flask import Blueprint, request, jsonify, url_for, redirect, render_template
from .models import User, UserCPF, UserCNPJ
from ...db import db

auth_bp = Blueprint('auth', __name__, template_folder='templates')

def is_cpf(document):
    # Add validation logic for CPF (typically 11 digits)
    return len(document) == 11

def is_cnpj(document):
    # Add validation logic for CNPJ (typically 14 digits)
    return len(document) == 14

@auth_bp.route('/registerUser', methods=['GET', 'POST'])
def registerUser():
    if request.method == 'POST':
        username = request.form['name']
        email = request.form['email']
        password1 = request.form['password1']
        password2 = request.form['password2']
        document_number = request.form['cpf_cnpj']

        # Validar entrada
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({'message': 'User already exists'})
        elif len(email) < 4:
            return jsonify({'message': 'Email must be greater than 3 characters.'})
        elif len(username) < 2:
            return jsonify({'message': 'Name must be greater than 1 character.'})
        elif password1 != password2:
            return jsonify({'message': 'Passwords don\'t match.'})
        elif len(password1) < 7:
            return jsonify({'message': 'Password must be at least 7 characters.'})
        elif not is_cpf(document_number) and not is_cnpj(document_number):
            return jsonify({'message': 'Invalid CPF or CNPJ.'})

        # Criar novo usuário
        new_user = User(username=username, email=email, password=password1, document_number=document_number)
        db.session.add(new_user)
        db.session.flush()  # Obter ID do usuário sem fazer commit ainda

        # Determinar se é CPF ou CNPJ e criar o registro correspondente
        if is_cpf(document_number):
            name = request.form.get('name')
            date_of_birth = request.form.get('date_of_birth')
            if not date_of_birth:
                return jsonify({'message': 'Date of Birth is required for CPF.'}), 400
            user_cpf = UserCPF(user_id=new_user.id, name=name, date_of_birth=date_of_birth)
            db.session.add(user_cpf)
        elif is_cnpj(document_number):
            company_name = request.form.get('company_name')
            date_of_foundation = request.form.get('date_of_foundation')
            if not company_name or not date_of_foundation:
                return jsonify({'message': 'Company Name and Date of Foundation are required for CNPJ.'}), 400
            user_cnpj = UserCNPJ(user_id=new_user.id, company_name=company_name, date_of_foundation=date_of_foundation)
            db.session.add(user_cnpj)
        
        # Commit das mudanças
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'})

    return render_template('auth/register.html')
@auth_bp.route('/login', methods=['GET', 'POST'])

def login():
    return render_template('auth/login.html')