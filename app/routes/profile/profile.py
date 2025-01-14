from flask import Blueprint, request, jsonify, url_for, redirect, render_template
from ..auth.models import User
from ...db import db

profile_bp = Blueprint('profile', __name__, template_folder='templates')

@profile_bp.route('/profile', methods=['GET'])
def profile():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return render_template('profile/profile.html')
    
@profile_bp.route('/editProfile', methods=['POST'])
def editProfile():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        user.username = request.form.get('name')
        user.email = request.form.get('email')
        user.address = request.form.get('address')
        db.session.commit()
        return render_template('profile/edit-profile.html')