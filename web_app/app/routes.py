import os
import json
from app import app
from flask import render_template, session
# from flask_socketio import emit
from .game import *

# Load sprites 
images_path = os.path.abspath("app/static/images/ship2")
imgs = []
for i in os.listdir(images_path):
    path = os.path.join(images_path, i)
    imgs.append({
        "src" : "static/images/ship2/"+i,
        "name" : i.replace(".png", "")
    })

@app.route('/')
@app.route('/index')
def index():    
    session.pop("loaded", None)
    return render_template('index.html', planets = [1,1], images=imgs, logo="draft1.png")

@app.route('/get/<id>/<cmd>')
def get(id, cmd):
    if "loaded" in session:
        cmd = int(cmd)
        status = step(id, cmd)
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/load/<id>')
def load(id):
    session["loaded"] = True
    return json.dumps(load_game(id))

# @socketio.on('my event')
# def test_message(message):
#     emit('my response', {'data': message['data']})
    
# @socketio.on('connect')
# def test_connect():
#     emit('my response', {'data': 'Connected'})