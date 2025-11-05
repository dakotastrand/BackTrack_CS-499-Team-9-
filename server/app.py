import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from werkzeug.security import generate_password_hash, check_password_hash 
import uuid
import jwt
import os
from datetime import datetime, timedelta # Keep this, it's used later


app = Flask(__name__)
# # Enable CORS to allow API requests from other origins (like a mobile app)
# CORS(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a-very-secret-key-that-should-be-changed')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

# Initialize SQLAlchemy without the app first to avoid circular imports
db = SQLAlchemy()

# Import models AFTER db is defined, but BEFORE db.init_app(app)
from table import User, Friend, Alert, AlertRecipient, Record
db.init_app(app) # Now initialize db with the app

socket_app = SocketIO(
    app, 
    cors_allowed_origins="*",
    async_mode='eventlet',  # Specify eventlet
    logger=True,
    engineio_logger=True
)
     
with app.app_context():
    db.create_all() # This creates tables if they don't exist

@app.route('/')
def index():
    users = User.query.order_by(User.username).all() # Fetch all users from the database
    return render_template('index.html', users=users)

# --- API Endpoints for User Authentication ---

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Missing username or password'}), 400

    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    # Check if user exists and password hash is correct
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create a token that expires in 24 hours
    token = jwt.encode({
        'user_id': user.user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token})


@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data or not 'email' in data:
        return jsonify({'error': 'Missing username, email, or password'}), 400

    username = data['username']
    email = data['email']

    # Check if user or email already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409 # Conflict
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email address already registered'}), 409

    # Hash the password for security
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user_id': new_user.user_id}), 201
    except Exception as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    

### Socket app ###

@socket_app.on("connect")
def connect():
    print(f'Client connected on socket: {request.sid}')

@socket_app.on("disconnect")
def disconnect():
    print(f'Client disconnected on socket: {request.sid}')

@socket_app.on("data")
def handle_message(data):
    print(f'Client sent data on socket: {str(data)}')