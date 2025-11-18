import eventlet
eventlet.monkey_patch()

import os
from datetime import datetime, timedelta, timezone
from flask import Flask, render_template, request, jsonify
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import jwt

# Local imports
from table import User, Friend, Alert, AlertRecipient, Record, db

load_dotenv()

# -------------------------------------------------------------------
# APP INITIALIZATION
# -------------------------------------------------------------------
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')

db.init_app(app) # Now initialize db with the app

with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()


socket_app = SocketIO(
    app,
    cors_allowed_origins="*", 
    async_mode='eventlet', # A comma was missing here
    logger=True,
    engineio_logger=True
)


# -------------------------------------------------------------------
# AUTH DECORATOR
# -------------------------------------------------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Parse Authorization: Bearer <token>
        if "Authorization" in request.headers:
            parts = request.headers["Authorization"].split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            user = User.query.get(data["user_id"])

            if not user:
                return jsonify({"message": "User not found"}), 404

            return f(user, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

    return decorated

# -------------------------------------------------------------------
# ROOT AND AUTHENTICATION ROUTES
# -------------------------------------------------------------------
@app.route('/')
def index():
    # A simple health-check endpoint.
    return "Server is running."

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not 'username' in data or not 'password' in data:
        return jsonify({'error': 'Missing username or password'}), 400

    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

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

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email address already registered'}), 409

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
        db.session.rollback()
        return jsonify({'error': 'A database integrity error occurred.'}), 409


# -------------------------------------------------------------------
# SOCKET.IO EVENTS
# -------------------------------------------------------------------
@socket_app.on("connect")
def connect():
    print(f'Client connected on socket: {request.sid}')

@socket_app.on("disconnect")
def disconnect():
    print(f'Client disconnected on socket: {request.sid}')

@socket_app.on("startTimer")
def start_timer(data):
    print(f'Client sent data on socket: {str(data)}')
    # This is where you would add your timer logic.

# -------------------------------------------------------------------
# FRIENDS ROUTES
# -------------------------------------------------------------------
@app.route("/api/friends", methods=["GET"])
@token_required
def get_friends(current_user):
    # This query joins Friend and User tables to get friend details in one go.
    # It handles cases where the current user is either user_id_1 or user_id_2.
    friends_query = db.session.query(
        User.username,
        Friend.favorite
    ).join(
        Friend,
        ((Friend.user_id_1 == current_user.user_id) & (Friend.user_id_2 == User.user_id)) |
        ((Friend.user_id_2 == current_user.user_id) & (Friend.user_id_1 == User.user_id))
    ).filter(
        (Friend.user_id_1 == current_user.user_id) |
        (Friend.user_id_2 == current_user.user_id)
    ).all()
 
    # The query returns a list of tuples (username, favorite).
    # We format it into the desired JSON structure.
    friends_list = [
        {"name": username, "favorite": favorite}
        for username, favorite in friends_query
    ]
 
    return jsonify(friends_list), 200


@app.route("/api/friends", methods=["POST"])
@token_required
def add_friend(current_user):
    data = request.get_json(silent=True)

    if not data or "username" not in data:
        return jsonify({"error": "Username required"}), 400

    username = data["username"]

    if username == current_user.username:
        return jsonify({"error": "Cannot add yourself"}), 400

    friend = User.query.filter_by(username=username).first()
    if not friend:
        # If the user doesn't exist, create a placeholder account for them.
        # This makes the UX smoother, as the friend can be added immediately.
        # A strong, random password prevents anyone from logging into this account.
        # The email is also a placeholder.
        placeholder_password = generate_password_hash(os.urandom(24).hex())
        friend = User(
            username=username,
            email=f"{username.lower()}@placeholder.user",
            password=placeholder_password
        )
        db.session.add(friend)
 
    existing = Friend.query.filter(
        ((Friend.user_id_1 == current_user.user_id) & (Friend.user_id_2 == friend.user_id)) |
        ((Friend.user_id_1 == friend.user_id) & (Friend.user_id_2 == current_user.user_id))
    ).first()

    if existing:
        return jsonify({"error": "Already friends"}), 409

    new_friend = Friend(user_id_1=current_user.user_id, user_id_2=friend.user_id)
    db.session.add(new_friend)
    db.session.commit()

    return jsonify({"message": "Friend added"}), 201


@app.route("/api/friends/<username>", methods=["DELETE"])
@token_required
def remove_friend(current_user, username):
    friend = User.query.filter_by(username=username).first()

    if not friend:
        return jsonify({"error": "Friend not found"}), 404

    friendship = Friend.query.filter(
        ((Friend.user_id_1 == current_user.user_id) & (Friend.user_id_2 == friend.user_id)) |
        ((Friend.user_id_1 == friend.user_id) & (Friend.user_id_2 == current_user.user_id))
    ).first()

    if not friendship:
        return jsonify({"error": "Not friends"}), 404

    db.session.delete(friendship)
    db.session.commit()

    return jsonify({"message": "Friend removed"}), 200


@app.route("/api/friends/<username>/favorite", methods=["PUT"])
@token_required
def toggle_favorite(current_user, username):
    data = request.get_json(silent=True)
    if not data or "favorite" not in data:
        return jsonify({"error": "Favorite status is required"}), 400

    friend_user = User.query.filter_by(username=username).first()
    if not friend_user:
        return jsonify({"error": "User not found"}), 404

    friendship = Friend.query.filter(
        ((Friend.user_id_1 == current_user.user_id) & (Friend.user_id_2 == friend_user.user_id)) |
        ((Friend.user_id_1 == friend_user.user_id) & (Friend.user_id_2 == current_user.user_id))
    ).first()

    if not friendship:
        return jsonify({"error": "You are not friends with this user"}), 404

    friendship.favorite = bool(data["favorite"])
    db.session.commit()

    return jsonify({"message": "Favorite updated"}), 200
