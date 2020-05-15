import logging
import os

from flask import Flask
# from flask_socketio import SocketIO

app = Flask(__name__)
# socketio = SocketIO(app)

from app import routes


log = logging.getLogger('werkzeug')
log.disabled = True

if __name__ == "__main__":
  app.run(debug=False, threaded=True, processes=2)
  # socketio.run(app)