import os
import json
from app import app
from flask import render_template, request
from .game import *
import numpy as np

print("LOAD ROUTES")

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
    print("LOAD INDEX")
    return render_template('index.html', planets = scene.planets, images=imgs, logo="draft1.png")

@app.route('/get/<cmd>')
def get(cmd):
    cmd = int(cmd)
    status = step(cmd)
    return json.dumps(status)