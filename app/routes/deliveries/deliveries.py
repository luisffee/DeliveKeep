from flask import Blueprint, request, jsonify, url_for, redirect, render_template
from .models import Delivery
from ...db import db

delivery_bp = Blueprint('delivery', __name__, template_folder='templates')

