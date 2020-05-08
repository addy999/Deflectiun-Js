from flask import Flask
import logging
import os

app = Flask(__name__)

from app import routes


log = logging.getLogger('werkzeug')
log.disabled = True

if __name__ == "__main__":
  app.run(debug=True)