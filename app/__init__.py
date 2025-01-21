from flask import Flask
from flask_cors import CORS
from config import config
from .db import InitDB
import os


def create_app(app_config='development'):
    app = Flask(__name__)
    db =  InitDB(app)
    Cors = CORS(app)
    CORS(app, resources={r'/*': {'origins': '*'}},CORS_SUPPORTS_CREDENTIALS = True)
    app.secret_key = os.environ.get('SECRET_KEY')
    app.config.from_object(config[app_config])
    app.config['SQLALCHEMY_DATABASE_URI'] = db.engine.url
    db = db.start()
    
    from .routes.auth.models import User
    from .routes.deliveries.models import Delivery
    from .routes.profile.models import Adresses, Payments
    
    with app.app_context():
        db.create_all()
    
    from .routes.auth.auth import auth_bp
    from .routes.deliveries.deliveries import delivery_bp
    from .routes.home.home import home_bp
    from .routes.profile.profile import profile_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(delivery_bp, url_prefix='/delivery')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(home_bp, url_prefix='/')
   
    return app