from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

app = Flask(__name__)
# Enable CORS to allow API requests from other origins (like a mobile app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

class User(db.Model):
    user_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # needs to store as hashes
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Friend(db.Model):
    friend_id = db.Column(db.String(80), primary_key=True)
    user_id_1 = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    user_id_2 = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    
    def __repr__(self):
        return f'<Friends_list {self.user_id_1} {self.user_id_2}>'


class Alert(db.Model):
    alert_id = db.Column(db.String(80), primary_key=True)
    user_id = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    total_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    
    def __repr__(self):
        return f'<Alert {self.user_id}>'
    
class AlertRecipient(db.Model):
    alert_recipient_id = db.Column(db.String(80), primary_key=True)
    recipient_friend_id = db.Column(db.String(80), db.ForeignKey('friend.friend_id'), nullable=False)
    alert_id = db.Column(db.String(80), db.ForeignKey('alert.alert_id'), nullable=False)
    notified_status = db.Column(db.String(20), nullable=False)
    
    def __repr__(self):
        return f'<AlertRecipient {self.recipient_friend_id}>'
    
class Record(db.Model):
    record_id = db.Column(db.String(80), primary_key=True)
    user_id = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    alert_id = db.Column(db.String(80), db.ForeignKey('alert.alert_id'), nullable=False)
    time_stamp = db.Column(db.DateTime, nullable=False)
    
    def __repr__(self):
        return f'<Record {self.user_id}>'
        
with app.app_context():
    db.create_all()


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your task'

    else:
        tasks = Todo.query.order_by(Todo.date_created).all() # Keep existing tasks
        users = User.query.all() # Fetch all users from the database
        return render_template('index.html', tasks=tasks, users=users)

@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting that task'

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task'

    else:
        return render_template('update.html', task=task)

# --- API Endpoints for Expo/Mobile App ---

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Todo.query.order_by(Todo.date_created).all()
    tasks_list = []
    for task in tasks:
        tasks_list.append({
            'id': task.id,
            'content': task.content,
            'completed': task.completed,
            'date_created': task.date_created.isoformat()
        })
    return jsonify(tasks=tasks_list)

@app.route('/api/tasks', methods=['POST'])
def add_task_api():
    data = request.get_json()
    if not data or not 'content' in data:
        return jsonify({'error': 'Missing content'}), 400

    new_task = Todo(content=data['content'])
    try:
        db.session.add(new_task)
        db.session.commit()
        # Return the created task, which is useful for the frontend
        return jsonify({
            'id': new_task.id,
            'content': new_task.content,
            'completed': new_task.completed,
            'date_created': new_task.date_created.isoformat()
        }), 201
    except Exception as e:
        print(f"Error adding task via API: {e}")
        return jsonify({'error': 'There was an issue adding your task'}), 500

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task_api(id):
    task = Todo.query.get_or_404(id)
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting task via API: {e}")
        return jsonify({'error': 'There was a problem deleting that task'}), 500

# --- API Endpoints for User Authentication ---

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