import sys
sys.path.append("../../DeflectiunCore")

from deflectiun_core.game import *
from copy import deepcopy
import math

def get_status(game):
    scene =  game.current_scene
    length, width = scene.size
    
    data = {
        "sc" : {
            "pos" : (scene.sc.x,scene.sc.y),
            "poly" : scene.sc.coords,
            "size" : (scene.sc.width, scene.sc.length),
            "rot" : scene.sc.theta,
            "gas_level" : scene.sc.gas_level,
            "i_gas_level" : scene.sc._initial_gas_level,
            "thrust" : {
                "mag" : scene.sc.thrust_mag,
                "dir" : scene.sc.thrust_direction,
                "on" : scene.sc.thrust
            }
        }
    }
    
    data.update({"n_planets" : len(scene.planets)})    
    for i,p in enumerate(scene.planets):
        p_data = {
            "pos": (p.x,p.y),
            "radius" : p.radius,
            "orbit" : {
                "center" : (p.orbit.center_x, p.orbit.center_y),
                "a" : p.orbit.a,
                "b" : p.orbit.b
            }
        }
        data.update({"p" + str(i+1) : p_data})
    
    data.update({
        "scene" : {
            "size" : (length, width),
            "win_region" : scene.win_region,
            "win_vel" : scene.win_min_velocity,
            "attempts" : scene.attempts,
            "completion_score" : scene.completion_score,
        }})
    
    return data

def step(game, cmd):
    
    won, fail = game.step(cmd)
    status = get_status(game)
    status.update({
        "won" : won,
        "fail" : fail
    })
    
    return status
    
