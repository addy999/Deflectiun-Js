import os
import json
from app import app
from flask import render_template, request
from .game import *
import numpy as np

SPEED_THRESHOLD = 8
OKAY_FOR_SPEED = True

screen_x, screen_y = 900, 700
sc = Spacecraft('Test', mass = 100, thrust_force = 4000, gas_level = 600, width=25, length=25)
orbit = Orbit(a=screen_x*500/1920, b=screen_y*500/1080, center_x=screen_x, center_y=screen_y/2, CW=True, angular_step = 2*np.pi/(200.0), progress = np.pi/2)
planet = Planet('Test', mass = 3e16, orbit = orbit)
scene = Scene((screen_x, screen_y),sc, [planet], win_region = ([0,0], [screen_x, 0]), win_velocity = 90.0)
_game = Game(scenes=[scene], fps=25)

@app.route('/')
@app.route('/index')
def index():
    _game.reset()
    return render_template('index.html', planets = scene.planets)

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
    cmd = int(cmd)
    status = step(_game, cmd)
    status.update({"speed" : OKAY_FOR_SPEED})
    return json.dumps(status)