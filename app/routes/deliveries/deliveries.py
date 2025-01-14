from flask import Blueprint, request, jsonify, url_for, redirect, render_template, send_file
from .models import Delivery
from ...db import db
import qrcode
import io

delivery_bp = Blueprint('delivery', __name__, template_folder='templates')

@delivery_bp.route('/getDeliveries', methods=['GET'])
def getDeliveries():
    deliveries = []
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        deliveries = Delivery.query.filter_by(user_id=user_id).all()
        if not deliveries:
            return jsonify({'message': 'No deliveries found'}), 404
        
    return render_template('deliveries/deliveries.html', deliveries=jsonify(deliveries))

@delivery_bp.route('/createDelivery', methods=['POST'])
def createDelivery():
    user_id = session.get('user_id')
    if request.method == 'POST':
        delivery_address = request.form.get('delivery_address')
        if not delivery_address or not delivery_arrival_date:
            return jsonify({'message': 'Delivery Address and Arrival Date are required.'}), 400
        new_delivery = Delivery(user_id=user_id, delivery_address=delivery_address, delivery_arrival_date=delivery_arrival_date)
        db.session.add(new_delivery)
        db.session.commit()
        return jsonify({'message': 'Delivery created successfully'}), 201
    return render_template('deliveries/create-delivery.html')

@delivery_bp.route('/qr_code', methods=['GET'])
def qr_code():
    if request.method == 'GET':
        delivery_type = request.args.get('delivery_type')
        if delivery_type == 'withdraw':
            delivery_id = request.args.get('delivery_id')
            delivery = Delivery.query.filter_by(id=delivery_id).first()
            if not delivery:
                return jsonify({'message': 'Delivery not found'}), 404

            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(delivery.id)
            qr.make(fit=True)

            img = qr.make_image(fill='black', back_color='white')
            buf = io.BytesIO()
            img.save(buf)
            buf.seek(0)

            return send_file(buf, mimetype='image/png')