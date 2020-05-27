import os
import json
from app import app
from flask import render_template, session, request
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
    
# logo = "draft1_min.png"
logo = "draft1-beta-01.png"
    
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', logo=logo), 404

@app.route('/')
@app.route('/index')
def index():    
    session.pop("loaded", None)
    reset_db()
    return render_template('index.html', planets = [1,2,3], images=imgs, logo=logo)

@app.route('/tutorial')
def tut():    
    return render_template('tut.html', logo=logo)

@app.route('/get/<cmd>/<prev_game_status>')
def get(cmd, prev_game_status):
    if "loaded" in session:
        status = step(str(session["id"]), json.loads(prev_game_status), int(cmd))
        # status = step(str(session["id"]), session["prev_game_status"], int(cmd))
        # session["prev_game_status"] = status
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/load/<id>/<screen_x>/<screen_y>')
def load(id, screen_x, screen_y):
    session["loaded"] = True
    session["id"] = id
    status = load_game(id, int(float(screen_x)), int(float(screen_y)))
    # session["prev_game_status"] = status
    return json.dumps(status)