import sqlite3
import time
import os 
import dill
# from .game import *

script_directory = os.path.dirname(os.path.abspath(__file__))
DATABASE = script_directory + "/sessions.db"

def reset_db():
    print("reset db")
    os.remove(DATABASE)
    conn = sqlite3.connect(DATABASE)
    curr = conn.cursor()
    curr.execute("CREATE TABLE sessions (id varchar(5) PRIMARY KEY, game data, time float)")
    conn.commit()
    conn.close()

def save_game(id, _game):
    conn = sqlite3.connect(DATABASE)
    curr = conn.cursor()
    packed = sqlite3.Binary(dill.dumps(_game, dill.HIGHEST_PROTOCOL))
    
    # Delete method
    # try: 
    #     curr.execute("INSERT INTO sessions VALUES (?, ?, ?)", (id, sqlite3.Binary(dill.dumps(_game)), time.time()))
    # except:
    #     curr.execute("DELETE FROM sessions WHERE id=?", (id,))  
    #     curr.execute("INSERT INTO sessions VALUES (?, ?, ?)", (id, sqlite3.Binary(dill.dumps(_game)), time.time()))
        
    # Replace method
    try:
        curr.execute("REPLACE INTO sessions VALUES (?, ?, ?)", (id, packed, time.time()))    
    except:
        curr.execute("INSERT INTO sessions VALUES (?, ?, ?)", (id, packed, time.time()))      
        
    conn.commit()
    curr.close()
    conn.close()
    
def get_game(id):
    conn = sqlite3.connect(DATABASE)
    curr = conn.cursor()
    
    # Load
    curr.execute("SELECT * FROM sessions WHERE id=?", (id,))
    _game = dill.loads(curr.fetchone()[1])
    
    curr.close()
    conn.close()
    
    return _game
    
    
    