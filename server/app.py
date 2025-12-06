import eventlet
eventlet.monkey_patch()

import os
from datetime import datetime, timedelta, timezone
from flask import Flask, render_template, request, jsonify
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash, check_password_hash 
import jwt
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage
from table import User, Friend, Alert, AlertRecipient, Record, db
import firebase_admin
from firebase_admin import credentials, firestore



SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER)




# Load environment variables from .env file
load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db')

cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)
fs = firestore.client()

from table import User, Friend, Alert, AlertRecipient, Record, db
db.init_app(app) # Now initialize db with the app

with app.app_context():
    db.create_all()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

socket_app = SocketIO(
    app, 
    cors_allowed_origins="*",
    async_mode='eventlet',  # Specify eventlet
    logger=True,
    engineio_logger=True
)

#Firebase Email Queueing Function

def queue_email(to_emails: list[str], subject: str, text: str, html: str | None = None):
    """
    Adds a document to the Firestore 'mail' collection.
    The Firebase Trigger Email extension will send the email.
    """
    if not to_emails:
        print("queue_email: no recipients, skipping")
        return

    doc = {
        "to": to_emails,
        "message": {
            "subject": subject,
            "text": text,
            "html": html or text,
        },
    }

    try:
        fs.collection("mail").add(doc)
        print(f"Queued email to {to_emails} with subject '{subject}'")
    except Exception as e:
        print("Error queueing email:", e)

     
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

@socket_app.on("data")
def handle_message(data):
    print(f'Client sent data on socket: {str(data)}')


def timer_task(
    sid,
    duration_minutes: float,
    owner_username: str,
    selected_friend_usernames: list[str],
    destination: str,
    alert_id: str,
):
    """Background task to wait and then notify the client AND send emails."""
    print(f"Timer started for {duration_minutes} minutes for client {sid}.")
    eventlet.sleep(duration_minutes * 60)
    print(f"Timer finished for client {sid}.")

    socket_app.emit("timerComplete", room=sid)

    emails = resolve_friend_emails(owner_username, selected_friend_usernames)

    if emails:
        if destination:
            text = f"{owner_username} did not check in from '{destination}' on time."
        else:
            text = f"{owner_username} did not check in on time."

        subject = f"{owner_username}'s BackTrack timer expired"

        queue_email(
            to_emails=emails,
            subject=subject,
            text=text,
            html=f"<p>{text}</p>",
        )

    with app.app_context():
        alert = Alert.query.filter_by(alert_id=alert_id).first()
        if alert:
            alert.status = "expired"

        recipients = AlertRecipient.query.filter_by(alert_id=alert_id).all()
        for r in recipients:
            r.notified_status = "sent"

        owner = User.query.filter_by(username=owner_username).first()
        if owner:
            record = Record(
                user_id=owner.user_id,
                alert_id=alert_id,
                time_stamp=datetime.now(timezone.utc),
            )
            db.session.add(record)

        db.session.commit()



@socket_app.on("startTimer")
def start_timer(data):
    """
    data example from the Expo app:
    {
      "minutes": 20,
      "ownerUsername": "Will",
      "selectedFriendUsernames": ["dakota",],
      "destination": "Library",
      "customMessage": "If I don't check in, please text me."
    }
    """
    print(f'Client sent data on socket: {str(data)}')

    try:
        minutes = float(data.get("minutes"))
    except (TypeError, ValueError, AttributeError):
        print(f'Invalid timer duration received from client {request.sid}: {data}')
        return

    if minutes <= 0:
        print(f'Non-positive timer duration from {request.sid}: {minutes}')
        return

    owner_username = data.get("ownerUsername")
    if not owner_username:
        print("No ownerUsername provided, cannot start timer.")
        return

    selected_friends = data.get("selectedFriendUsernames") or []
    destination = data.get("destination") or ""
    custom_message = data.get("customMessage") or ""

    with app.app_context():
        owner = User.query.filter_by(username=owner_username).first()
        if not owner:
            print(f"Owner {owner_username} not found")
            return

        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(minutes=minutes)

        alert = Alert(
            user_id=owner.user_id,
            start_time=start_time,
            end_time=end_time,
            total_time=end_time - start_time,
            status="pending",
            message=custom_message or "Timer expired."
        )
        db.session.add(alert)

        db.session.flush()  
        for friend_username in selected_friends:
            friend_user = User.query.filter_by(username=friend_username).first()
            if not friend_user:
                continue

            friend_rel = Friend.query.filter(
                ((Friend.user_id_1 == owner.user_id) & (Friend.user_id_2 == friend_user.user_id)) |
                ((Friend.user_id_2 == owner.user_id) & (Friend.user_id_1 == friend_user.user_id))
            ).first()

            if not friend_rel:
                continue

            ar = AlertRecipient(
                recipient_friend_id=friend_rel.friend_id,
                alert_id=alert.alert_id,
                notified_status="pending"
            )
            db.session.add(ar)

        db.session.commit()

    socket_app.start_background_task(
        target=timer_task,
        sid=request.sid,
        duration_minutes=minutes,
        owner_username=owner_username,
        selected_friend_usernames=selected_friends,
        destination=destination,
        alert_id=alert.alert_id,
    )

def send_email(subject: str, body: str, recipients: list[str]) -> None:
    """Send a plain-text email to a list of recipients."""
    if not recipients:
        print("send_email: no recipients, skipping.")
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_FROM
    msg["To"] = ", ".join(recipients)
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print(f"Email sent to: {recipients}")
    except Exception as e:
        print("Error sending email:", e)

    
def get_friend_emails_for_ids(owner_user_id: str, friend_ids: list[str]) -> list[str]:
    if not friend_ids:
        return []

    friends = Friend.query.filter(
        Friend.friend_id.in_(friend_ids),
        Friend.user_id == owner_user_id,
    ).all()

    emails: list[str] = []
    for f in friends:
        if getattr(f, "email", None):
            emails.append(f.email)

    
    return sorted(set(emails))



def resolve_friend_emails(owner_username: str, selected_friend_usernames: list[str]) -> list[str]:
    """
    Given an owner username and a list of friend usernames,
    return the email addresses of valid friends from the SQL database.
    """
    with app.app_context():
        owner = User.query.filter_by(username=owner_username).first()
        if not owner:
            print(f"Owner user {owner_username} not found")
            return []

        emails: list[str] = []

        for friend_username in selected_friend_usernames:
            friend_user = User.query.filter_by(username=friend_username).first()
            if not friend_user:
                print(f"Friend user {friend_username} not found")
                continue

            # Check that a Friend relationship actually exists between owner and friend
            friend_rel = Friend.query.filter(
                ((Friend.user_id_1 == owner.user_id) & (Friend.user_id_2 == friend_user.user_id)) |
                ((Friend.user_id_2 == owner.user_id) & (Friend.user_id_1 == friend_user.user_id))
            ).first()

            if not friend_rel:
                print(f"No Friend relationship between {owner_username} and {friend_username}")
                continue

            emails.append(friend_user.email)

        return emails
