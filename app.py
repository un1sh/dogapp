from flask import Flask, render_template, request, send_from_directory, Response
import tensorflow as tf
import os
import numpy as np
import PIL
from PIL import Image
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import jwt
from dotenv import load_dotenv

load_dotenv()



app = Flask(__name__,static_folder='static')
app.config['UPLOAD_FOLDER']=os.path.join(app.root_path,'images')
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = (f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@localhost:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}")


def load_model():
    model = tf.keras.models.load_model('highaccuracy.h5')
    return model

model = load_model()
breed_list = os.listdir('stanford_dataset/Annotation')
breed_list.sort()
index2label = dict((index, dog_breed) for index, dog_breed in enumerate(breed_list))
image_width = 128
image_height = 128
num_channels = 3

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    picture_url = db.Column(db.String(160), unique=False, nullable=True)
    password = db.Column(db.String(160), unique=False, nullable=True)
    google_signin = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<User {self.username}>'    

class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    breed = db.Column(db.String(80), nullable=False)
    
    user = relationship('User', backref=db.backref('favorites', lazy=True))
    
    def __repr__(self):
        return f"<Favorite {self.username} - {self.breed}>"


@app.route('/identify', methods = ['POST'])
@cross_origin()
def predict():
    
    image = request.files['imagefile']
    image_path = "images/"+image.filename
    image.save(image_path)
    image = tf.io.read_file(image_path)
    image = tf.image.decode_jpeg(image, channels=num_channels)
    image = tf.image.resize(image, [image_height, image_width])
    image = image / 255.0
    image = np.expand_dims(image.numpy(),axis=0)
    
    prediction = model.predict(image)
    predicted_breed = index2label[prediction.argmax(axis=1)[0]][10:] # [10:] truncates leading unnecessary letters
    prediction_conf = (prediction.tolist()[0])[prediction.argmax(axis=1)[0]]
    prediction_conf = int(prediction_conf * 100)
    threshold = 25
    print("hello")
    if prediction_conf < threshold:
        return {'predicted_breed': None, 'predicted_conf': None}, 200, {'Content-Type':'application/json'}

    # return render_template('',predicted_label=predicted_breed,predicted_description="",image_path=image_path)
    return {'predicted_breed': predicted_breed, 'predicted_conf': prediction_conf}, 200, {'Content-Type':'application/json'}

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename,as_attachment=True)


@app.route('/register',  methods = ['POST'])
@cross_origin()
def register():
    
    try:
        user_data = request.get_json()
        gsignin_flag = False
        if user_data.get("token"):
            user_data = jwt.decode(user_data.get("token")["credential"], options={"verify_signature": False})
            gsignin_flag = True

        username = user_data.get('name')
        email = user_data.get('email')
        picture_url = user_data.get('picture', None)
        password = user_data.get('password', None)
        
        user = User.query.filter_by(email=email).first()

        if user:
            return {"message": "User already exist"}, 403, {'Content-Type':'application/json'}

        user = User(username=username, email=email, password=password, google_signin=gsignin_flag, picture_url=picture_url)
        db.session.add(user)
        db.session.commit()
        return {"username": user.username, "email": email, 'picture_url': picture_url}, 201, {'Content-Type':'application/json'}
    except Exception as e:
        print(e)
        return {"message": "Something went wrong"}, 500, {'Content-Type':'application/json'}

@app.route('/login',  methods = ['POST'])
@cross_origin()
def login():
    try:
        user_data = request.get_json()
        gsignin_flag = False
        if user_data.get("token"):
            user_data = jwt.decode(user_data.get("token")["credential"], options={"verify_signature": False})
            gsignin_flag = True

        email = user_data.get('email')
        password = user_data.get('password', None)
        
        user = User.query.filter_by(email=email).first()

        if user:
            if user.password == password or gsignin_flag:
                return {"username": user.username, "email": user.email, 'picture_url': user.picture_url}, 201, {'Content-Type':'application/json'}
            else:
                return {"message": "Password incorrect"}, 401, {'Content-Type':'application/json'}
            
        
        return {"message": "User not found"}, 404, {'Content-Type':'application/json'}
    
    except Exception as e:
        print(e)
        return {"message": "Something went wrong"}, 500, {'Content-Type':'application/json'}


@app.route('/favorite', methods=['POST'])
@cross_origin()
def add_favorite():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        username = data.get('username')
        breed = data.get('breed')
    
        # Check if this favorite already exists
        existing_favorite = Favorite.query.filter_by(user_id=user_id, breed=breed).first()
        if existing_favorite:
            return {"message": "Dog already favorited"}, 400, {'Content-Type': 'application/json'}
        
        # Add the favorite
        favorite = Favorite(user_id=user_id, username=username, breed=breed)
        db.session.add(favorite)
        db.session.commit()

        return {"message": "Dog favorited successfully"}, 201, {'Content-Type': 'application/json'}
    
    except Exception as e:
        print(e)
        return {"message": "Something went wrong"}, 500, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(port=3000, debug=True)
