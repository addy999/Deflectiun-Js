import sys
sys.path.append("../../DeflectiunCore")

from spaceshots_core.game import *
from spaceshots_core.scene import LevelBuilder, closest_dist_to_sc
from copy import deepcopy
import math

def get_status(game):
    
    scene =  game.current_scene
    length, width = scene.size
    
    data = {
        "sc" : {
            "pos" : (scene.sc.x,scene.sc.y),
            "speed" : round(scene.sc.vel.mag),
            "poly" : scene.sc.coords,
            "size" : (scene.sc.width, scene.sc.length),
            "rot" : scene.sc.theta,
            "gas_level" : scene.sc.gas_level,
            "i_gas_level" : scene.sc._initial_gas_level,
            "closest_dist_to_planet" : closest_dist_to_sc(scene.sc, scene.planets),
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

def step(cmd):
    
    won, fail, message = _game.step(cmd)
    status = get_status(_game)
    status.update({
        "won" : won,
        "fail" : fail,
        "message" : message
    })

    return status

def load_game():
    global _game
    _game = Game(scenes=[builder.create("easy") for i in range(10)], fps=25)
    status = get_status(_game)
    status.update({
        "won" : False,
        "fail" : False,
        "message" : ""
    })
    return status
    

screen_x, screen_y = 900, 700
sc = Spacecraft('Test', mass = 100, thrust_force = 2000, gas_level = 500, width=35, length=35)

planet = Planet('Test', mass = 3e16, orbit = Orbit(a=screen_x*500/1920, b=screen_y*500/1080, center_x=screen_x, center_y=screen_y/2, CW=True, angular_step = 2*np.pi/(200.0), progress = np.pi/2))

planet2 = Planet('Test2', mass = 2e16, orbit = Orbit(a=screen_x*800/1920, b=screen_y*500/1080, center_x=200, center_y=screen_y/2, CW=False, angular_step = 2*np.pi/(200.0), progress = np.pi/4))

scene = Scene((screen_x, screen_y),sc, [planet, planet2], win_region = ([0,screen_y], [screen_x, screen_y]), win_velocity = 90.0)
builder = LevelBuilder(screen_x, screen_y)
_game = None
    
