from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

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
        tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template('index.html', tasks=tasks)

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