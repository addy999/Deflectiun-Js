import os
import json
from app import app
from flask import render_template, request
from .game import *

cmd_map = {
        0: "nuthin",
        1: "up",
        2: "left",
        3: "down", 
        4: "right"
    }
pos = [0,0]
pos_step = 5

screen_x, screen_y = 900, 700
sc = Spacecraft('Test', mass = 100, thrust_force = 3000, gas_level = 600, width=50, length=50)
orbit = Orbit(a=screen_x*500/1920, b=screen_y*500/1080, center_x=screen_x, center_y=screen_y/2, CW=True, angular_step = 2*np.pi/(200.0), progress = np.pi/2)
planet = Planet('Test', mass = 3e16, orbit = orbit)
scene = Scene((screen_x, screen_y),sc, [planet], win_region = ([0,0], [screen_x, 0]), win_velocity = 90.0)
_game = Game(scenes=[scene], fps=25)


def change_pos(cmd):
    global pos
    
    if cmd == 3: # up (switched)
        pos = [pos[0], pos[1] + pos_step]
    elif cmd == 2: # left 
        pos = [pos[0] - pos_step, pos[1]]
    elif cmd == 1: # down (switched)
        pos = [pos[0], pos[1] - pos_step]
    elif cmd == 4: # right
        pos = [pos[0] + pos_step, pos[1]]
    
    return pos

@app.route('/')
@app.route('/index')
def index():
    pos = [0,0]
    return render_template('index.html', planets = scene.planets)

# @app.route('/step', methods=['POST'])
# def step():
#     command = int(request.form['cmd'])    
#     return json.dumps('test')

@app.route('/get/<cmd>')
def get(cmd):
    cmd = int(cmd)
    status = step(_game, cmd)

    return json.dumps(status)