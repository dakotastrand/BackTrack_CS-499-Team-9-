
import uuid
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # needs to store as hashes
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Friend(db.Model):
    friend_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id_1 = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    user_id_2 = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='accepted')
    favorite = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Friends_list {self.user_id_1} {self.user_id_2}>'


class Alert(db.Model):
    alert_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    total_time = db.Column(db.Interval, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    
    def __repr__(self):
        return f'<Alert {self.user_id}>'
    
class AlertRecipient(db.Model):
    alert_recipient_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    recipient_friend_id = db.Column(db.String(80), db.ForeignKey('friend.friend_id'), nullable=False)
    alert_id = db.Column(db.String(80), db.ForeignKey('alert.alert_id'), nullable=False)
    notified_status = db.Column(db.String(20), nullable=False)
    
    def __repr__(self):
        return f'<AlertRecipient {self.recipient_friend_id}>'
    
class Record(db.Model):
    record_id = db.Column(db.String(80), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(80), db.ForeignKey('user.user_id'), nullable=False)
    alert_id = db.Column(db.String(80), db.ForeignKey('alert.alert_id'), nullable=False)
    time_stamp = db.Column(db.DateTime, nullable=False)
    
    def __repr__(self):
        return f'<Record {self.user_id}>'