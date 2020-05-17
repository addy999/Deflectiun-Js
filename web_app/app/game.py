import sys
import math
sys.path.append("../../DeflectiunCore")

from spaceshots_core.game import *
from spaceshots_core.assests import *
from spaceshots_core.physics import * 
from spaceshots_core.scene import LevelBuilder, closest_dist_to_sc
from .db import *
from copy import deepcopy

def get_status(game):
    
    scene =  game.current_scene
    length, width = scene.size
    
    data = {
        "sc" : {
            "pos" : (round(scene.sc.x,1),round(scene.sc.y,1)),
            "speed" : round(scene.sc.vel.mag),
            "poly" : [[round(e,1) for e in i] for i in scene.sc.coords],
            "size" : (scene.sc.width, scene.sc.length),
            "rot" : round(scene.sc.theta,1),
            "gas_level" : scene.sc.gas_level,
            "i_gas_level" : scene.sc._initial_gas_level,
            "closest_dist_to_planet" : round(closest_dist_to_sc(scene.sc, scene.planets),1),
            "thrust" : {
                "mag" : scene.sc.thrust_mag,
                "dir" : scene.sc.thrust_direction if scene.sc.thrust else "na",
                "on" : scene.sc.thrust
            }
        }
    }
    
    data.update({"n_planets" : len(scene.planets)})    
    for i,p in enumerate(scene.planets):
        p_data = {
            "pos": [round(i) for i in (p.x,p.y)],
            "radius" : round(p.radius,1),
            "orbit" : {
                "center" : [round(i,1) for i in (p.orbit.center_x, p.orbit.center_y)],
                "a" : round(p.orbit.a,1),
                "b" : round(p.orbit.b,1)
            }
        }
        data.update({"p" + str(i+1) : p_data})
    
    data.update({
        "scene" : {
            "size" : (length, width),
            "win_region" : [[round(i,1) for i in point] for point in scene.win_region],
            "win_vel" : scene.win_min_velocity,
            "attempts" : scene.attempts,
            "completion_score" : scene.completion_score,
        }})
    
    return data

def step(id, cmd):
    _game = get_game(id)
    won, fail, message = _game.step(cmd)
    save_game(id, _game)
    status = get_status(_game)
    status.update({
        "won" : won,
        "fail" : fail,
        "message" : message
    })

    return status

def load_game(id):
    _game = Game(scenes=[builder.create("easy") for i in range(10)], fps=10)
    save_game(id, _game)
    status = get_status(_game)
    status.update({
        "won" : False,
        "fail" : False,
        "message" : ""
    })
    return status
    
screen_x, screen_y = 900, 700
builder = LevelBuilder(screen_x, screen_y)