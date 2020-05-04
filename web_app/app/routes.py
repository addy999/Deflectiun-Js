import os
import json
from app import app
from flask import render_template, request

cmd_map = {
        0: "nuthin",
        1: "up",
        2: "left",
        3: "down", 
        4: "right"
    }

pos = [0,0]
pos_step = 5

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
    return render_template('index.html')

@app.route('/step', methods=['POST'])
def step():
    
    command = int(request.form['cmd'])
    # print(command)
    
    return json.dumps('test')

@app.route('/get/<cmd>')
def get(cmd):
    cmd = int(cmd)
    return json.dumps(change_pos(cmd))