import os
import json
from app import app
from flask import render_template, request
from .game import *
import numpy as np

OKAY_FOR_SPEED = True

screen_x, screen_y = 900, 700
sc = Spacecraft('Test', mass = 100, thrust_force = 2000, gas_level = 500, width=35, length=35)

planet = Planet('Test', mass = 3e16, orbit = Orbit(a=screen_x*500/1920, b=screen_y*500/1080, center_x=screen_x, center_y=screen_y/2, CW=True, angular_step = 2*np.pi/(200.0), progress = np.pi/2))

planet2 = Planet('Test2', mass = 2e16, orbit = Orbit(a=screen_x*800/1920, b=screen_y*500/1080, center_x=200, center_y=screen_y/2, CW=False, angular_step = 2*np.pi/(200.0), progress = np.pi/4))

scene = Scene((screen_x, screen_y),sc, [planet, planet2], win_region = ([0,screen_y], [screen_x, screen_y]), win_velocity = 90.0)
builder = LevelBuilder(screen_x, screen_y)
_game = None

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
    global _game
    _game = Game(scenes=[builder.create("medium")], fps=25)
    return render_template('index.html', planets = scene.planets, images=imgs)

@app.route('/speedupdate', methods=['POST'])
def speed_update():
    global OKAY_FOR_SPEED
    speed = float(request.form['speed'])    
    OKAY_FOR_SPEED = speed>=SPEED_THRESHOLD
    return {}

@app.route('/speedcheck')
def speed_check():
    global OKAY_FOR_SPEED
    return json.dumps(OKAY_FOR_SPEED)

@app.route('/get/<cmd>')
def get(cmd):
    global _game
    cmd = int(cmd)
    status = step(_game, cmd)
    status.update({"speed" : OKAY_FOR_SPEED})
    return json.dumps(status)