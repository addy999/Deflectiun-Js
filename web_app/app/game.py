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
            "rot" : scene.sc.vel.theta - math.pi*0,
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
    
    data.update({"screen" : (length, width)})
    
    return data

def step(game, cmd):
    
    won, fail = game.step(cmd)
    status = get_status(game)
    status.update({
        "won" : won,
        "fail" : fail
    })
    
    return status
    
