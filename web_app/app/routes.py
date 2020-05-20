import os
import json
from app import app
from flask import render_template, session, request
# from flask_socketio import emit
from .game import *
from .db import reset_db

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
    reset_db()
    return render_template('index.html', planets = [1,1], images=imgs, logo="draft1.png")

@app.route('/get/<id>/<cmd>/<prev_game_status>')
def get(id, cmd, prev_game_status):
    if "loaded" in session:
        prev_game_status = json.loads(prev_game_status)
        prev_game_status.update({"init_orbits": session["init_orbits"]})
        prev_game_status.update({"sc_start_pos": session["sc_start_pos"]})
        status = step(prev_game_status, int(cmd))
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/post', methods = ['POST'])
def post():
    if "loaded" in session:
        _id = request.form["id"]
        cmd = int(request.form["cmd"])
        prev_game_status = json.loads(request.form["game"])    
        prev_game_status.update({"init_orbits": session["init_orbits"]})
        prev_game_status.update({"sc_start_pos": session["sc_start_pos"]})
        status = step(prev_game_status, cmd)
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/load/<id>')
def load(id):
    session["loaded"] = True
    status = load_game(id)
    session["init_orbits"] = status["init_orbits"]
    session["sc_start_pos"] = status["sc_start_pos"] 
    return json.dumps(status)

# @socketio.on('my event')
# def test_message(message):
#     emit('my response', {'data': message['data']})
    
# @socketio.on('connect')
# def test_connect():
#     emit('my response', {'data': 'Connected'})