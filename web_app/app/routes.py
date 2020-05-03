import os
import json
from app import app
from flask import render_template, request

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/step', methods=['POST'])
def step():
    
    command = int(request.form['cmd'])
    print(command)
    
    return json.dumps('test')

@app.route('/get/<jsdata>')
def get(jsdata):
    return jsdata