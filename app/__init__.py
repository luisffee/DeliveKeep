from flask import Flask
from flask_cors import CORS
from config import config
from .db import InitDB


def create_app(app_config='development'):
    app = Flask(__name__)
    db =  InitDB(app)
    Cors = CORS(app)
    CORS(app, resources={r'/*': {'origins': '*'}},CORS_SUPPORTS_CREDENTIALS = True)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.secret_key = 'secret'
    app.config.from_object(config[app_config])
    app.config['SQLALCHEMY_DATABASE_URI'] = db.engine.url
    db = db.start()
    
    from .routes.auth.models import User
    from .routes.deliveries.models import Delivery
    
    with app.app_context():
        db.create_all()
    
    from .routes.auth.auth import auth_bp
    from .routes.deliveries.deliveries import delivery_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(delivery_bp, url_prefix='/delivery')
   
    return app