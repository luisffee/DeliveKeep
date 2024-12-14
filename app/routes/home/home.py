from flask import Blueprint, request, jsonify, url_for, redirect, render_template, session

home_bp = Blueprint('home', __name__, template_folder='templates')

@auth_bp.route('/', methods=['GET'])
def home():
    return render_template('home.html')