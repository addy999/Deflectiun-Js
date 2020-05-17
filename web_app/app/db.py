import sqlite3
import time
from .game import *

DATABASE = "sessions.db"
conn = sqlite3.connect(DATABASE)

def save_game(id, game):
    curr = conn.cursor()
    curr.execute("INSERT INTO sessions VALUES (?, ?, ?)", (id, sqlite3.Binary(game), time.time()))
    # conn.commit()
    curr.close()
    
def get_game(id):
    curr = conn.cursor()
    games = {}
    for row in curr.execute("SELECT * FROM sessions"):
        games[row[0]] = row[1]
        
    if id not in games:
        return None
    
    _game = games[id]
    curr.close()
    
    return _game
    
    
    