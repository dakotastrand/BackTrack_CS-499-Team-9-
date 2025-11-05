import eventlet
eventlet.monkey_patch()

import os
from datetime import datetime, timedelta, timezone
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash, check_password_hash 
import jwt
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')

# Initialize SQLAlchemy without the app first to avoid circular imports
db = SQLAlchemy()

# Import models AFTER db is defined, but BEFORE db.init_app(app)
from table import User, Friend, Alert, AlertRecipient, Record
db.init_app(app) # Now initialize db with the app

# Initialize Flask-Migrate
migrate = Migrate(app, db)

socket_app = SocketIO(
    app, 
    cors_allowed_origins="*",
    async_mode='eventlet',  # Specify eventlet
    logger=True,
    engineio_logger=True
)
     
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
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
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
    hashed_password = generate_password_hash(data['password'])

    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user_id': new_user.user_id}), 201
    except IntegrityError:
        db.session.rollback() # Roll back the transaction
        return jsonify({'error': 'A database integrity error occurred. The username or email may already be taken.'}), 409
    

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


@socket_app.on("startTimer")
def start_timer(data):
    print(f'Client sent data on socket: {str(data)}')
    try: # It's better to be specific about the data structure you expect
        minutes = float(data)
    except ValueError:
        print(f'Invalid timer duration received from client {request.sid}: {data}')
        return # Ignore invalid data

    def timer_task(sid, duration_minutes):
        """Background task to wait and then notify the client."""
        print(f"Timer started for {duration_minutes} minutes for client {sid}.")
        eventlet.sleep(duration_minutes * 60) # redo this to be a separate thread. eventlet.sleep is non-blocking, # the timer still wokrs even if app is closed, #past the presentation
        print(f"Timer finished for client {sid}.")
        socket_app.emit("timerComplete", room=sid)

    # Use socket_app.start_background_task for safe background jobs with eventlet
    socket_app.start_background_task(target=timer_task, sid=request.sid, duration_minutes=minutes)
    