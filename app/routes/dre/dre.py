from eralchemy import render_er
from flask import Blueprint, request, jsonify, url_for, redirect, render_template, send_file
from ...db import db

dre_bp = Blueprint('dre', __name__, template_folder='templates')

@dre_bp.route('/getDRE', methods=['GET'])
def getDRE():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        dre = DRE.query.filter_by(user_id=user_id).first()
        if not dre:
            return jsonify({'message': 'DRE not found'}), 404
        
        # Generate ER diagram
        db_uri = db.engine.url
        output_file = 'er_diagram.png'
        render_er(db_uri, output_file)

        return send_file(output_file, mimetype='image/png')