import os
import json
from app import app
from flask import render_template, session, request
# from flask_socketio import emit
from .game import *
from .db import reset_db

N_COOKIES = 7

def save_game_cookie(game_str):
    session["game"] = game_str
    # cookie_len = int(len(game_str)/N_COOKIES)
    # sub_strings = []
    # count = 0
    # for i in range(0, len(game_str), cookie_len):
    #     count += 1
    #     if count==N_COOKIES:
    #         sub_strings.append(game_str[i:])
    #     else:
    #         sub_strings.append(game_str[i:i+cookie_len])
    
    # for i, cookie in enumerate(sub_strings):
    #     session["game"+str(i)] = cookie
        
def get_game_cookie():
    return session["game"]
    # sub_strings = []
    # for key,val in session.items():
    #     if "game" in key:
    #         sub_strings.append(session[key])
    
    # return ''.join(sub_strings)

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

# @app.route('/get/<id>/<cmd>/<game_str>')
# def get(id, cmd, game_str=str):
#     if "loaded" in session:
#         cleaned_game_str = game_str.replace("+", "\\").strip()
#         status = step(cleaned_game_str, int(cmd))
#         return json.dumps(status)
#     else:
#         return json.dumps(False)

@app.route('/post', methods = ['POST'])
def post():
    if "loaded" in session:
        _id = request.form["id"]
        cmd = int(request.form["cmd"])
        game_str = request.form["game"]        
        status = step(game_str, cmd)
        return json.dumps(status)
    else:
        return json.dumps(False)

@app.route('/load/<id>')
def load(id):
    session["loaded"] = True
    status = load_game(id)
    return json.dumps(status)

# @socketio.on('my event')
# def test_message(message):
#     emit('my response', {'data': message['data']})
    
# @socketio.on('connect')
# def test_connect():
#     emit('my response', {'data': 'Connected'})