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

# @app.route('/get/<id>/<cmd>')
# def get(id, cmd):
#     if "loaded" in session:
#         status, session["game"] = step(session["game"], int(cmd))
#         return json.dumps(status)
#     else:
#         return json.dumps(False)

@app.route('/post', methods = ['POST'])
def post():
    if "loaded" in session:
        _id = request.form["id"]
        cmd = int(request.form["cmd"])
        prev_game_status = json.loads(request.form["game"])    
        prev_game_status.update({"init_orbits": json.loads(request.form["init_orbits"])})
        prev_game_status.update({"sc_start_pos": json.loads(request.form["sc_start_pos"])})
        # prev_game_status = session["prev_game"] 
        status = step(prev_game_status, cmd)
        # session["prev_game"]  = status
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/load/<id>')
def load(id):
    session["loaded"] = True
    status = load_game(id)
    # session["prev_game"] = status    
    return json.dumps(status)

# @socketio.on('my event')
# def test_message(message):
#     emit('my response', {'data': message['data']})
    
# @socketio.on('connect')
# def test_connect():
#     emit('my response', {'data': 'Connected'})