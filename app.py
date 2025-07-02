from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
db = SQLAlchemy(app)

class InventoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Item %r>' % self.name

@app.route('/')
def hello_world():
    return 'Hello, from your inventory management system!'

@app.route('/init_db')
def init_db():
    with app.app_context():
        db.create_all()
    return 'Database tables created!'

if __name__ == '__main__':
    app.run(debug=True)