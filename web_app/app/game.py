import sys
import math
sys.path.append("../SpaceshotsCore")

from spaceshots_core.game import *
from spaceshots_core.assests import *
from spaceshots_core.physics import * 
from spaceshots_core.scene import LevelBuilder, closest_dist_to_sc
from flask import session
from .db import *
from copy import deepcopy
import sys

FPS = 1000/70

def get_status(game):
    
    scene =  game.current_scene
    length, width = scene.size
    
    data = {
        "sc" : {
            "mass" : round(scene.sc.mass,2),
            "pos" : (round(scene.sc.x,2),round(scene.sc.y,2)),
            "speed" : round(scene.sc.vel.mag),
            "poly" : [[round(e,2) for e in i] for i in scene.sc.coords],
            "size" : (scene.sc.width, scene.sc.length),
            "rot" : round(scene.sc.theta,2),
            "gas_level" : scene.sc.gas_level,
            "min_dist_to_planet" : round(scene.sc.min_dist_to_planet,2),
            "gas_p_thrust" : scene.sc.gas_per_thrust,
            "i_gas_level" : scene.sc._initial_gas_level,
            "closest_dist_to_planet" : round(closest_dist_to_sc(scene.sc, scene.planets),1),
            "p" : [scene.sc.p.x, scene.sc.p.y],
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
            "pos": [round(i,2) for i in (p.x,p.y)],
            "mass" : round(p.mass,1),
            "radius" : round(p.radius,1),
            "orbit" : {
                "center" : [round(i,1) for i in (p.orbit.center_x, p.orbit.center_y)],
                "a" : round(p.orbit.a,1),
                "b" : round(p.orbit.b,1),
                "cw" : p.orbit.cw,
                "ang_step" : p.orbit.angular_step,
                "progress" : round(p.orbit.progress,2)
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
            "attempt_reduction" : scene.attempt_score_reduction,
            "gas_bonus" : scene.gas_bonus_score,
            # "init_orbits" : scene.initial_orbit_pos
        }})
    
    return data

def status_to_game(status):
    
    status = dict(status)
    
    # Sc
    sc = Spacecraft('', status["sc"]["mass"], status["sc"]["gas_level"], status["sc"]["thrust"]["mag"], status["sc"]["size"][0], status["sc"]["size"][1], status["sc"]["gas_p_thrust"], status["sc"]["min_dist_to_planet"])
    sc.x, sc.y = status["sc"]["pos"]
    sc.p = Momentum(status["sc"]["p"][0],status["sc"]["p"][1])
    sc.gas_level = status["sc"]["gas_level"] # take care of the rounding in init
    sc._initial_gas_level = status["sc"]["i_gas_level"]
    
    # Planets
    planets = []
    for i in range(status["n_planets"]):
        p = status["p"+str(i+1)]
        o = Orbit(p["orbit"]["a"], p["orbit"]["b"], p["orbit"]["center"][0], p["orbit"]["center"][1], CW=p["orbit"]["cw"])
        o.angular_step = p["orbit"]["ang_step"]
        planet = Planet("", p["mass"], orbit=o, radius_per_kilogram=p['radius']/p["mass"])
        planet.orbit.progress = p["orbit"]["progress"]
        planet.x, planet.y = p["pos"]
        planet.make_poly()
        planets.append(planet)
    
    # Scene    
    scene = Scene(status["scene"]["size"], sc, planets, status["scene"]["win_region"], status["scene"]["win_vel"], status["scene"]["completion_score"], status["scene"]["attempt_reduction"], status["scene"]["gas_bonus"], reset=False)    
    scene.attempts = status["scene"]["attempts"]
    scene.won, scene.fail = status["won"], status["fail"]
    
    # Init info
    scene.initial_orbit_pos = session["scene_init_info"]["init_orbits"]
    scene.sc_start_pos = session["scene_init_info"]["sc_start_pos"]
    
    return Game(FPS, [scene], reset=False)

def step(id, prev_status, cmd):

    start = time.time()
    _game = status_to_game(prev_status)
    won, fail, message = _game.step(cmd)
    level_score = [0,0,0]
    done = False
    
    if won:
        level_score = _game.calc_score()
        session["game_info"]["level_i"] += 1
        session["game_info"]["total_score"] += level_score[0]
        
        # Get new level
        scene = get_scene(id, session["game_info"]["level_i"])
        if not scene: 
            done=True
        else:
            _game = Game(scenes=[scene], fps=FPS)
            session["scene_init_info"] = {
            "init_orbits" : _game.scenes[0].initial_orbit_pos,
            "sc_start_pos" : _game.scenes[0].sc_start_pos
            }
        
    status = get_status(_game)
    status.update({
        "won" : won,
        "fail" : fail,
        "message" : message,
        "level_i" :  session["game_info"]["level_i"],
        "n_levels" : session["game_info"]["n_levels"],
        "scores" : level_score,
        "total_score" : session["game_info"]["total_score"],
        "done" : done
    })

    return status

def load_game(id, screen_x, screen_y):
    
    builder = LevelBuilder(screen_x, screen_y)
    scenes=[builder.create(level) for level in ["easy", "medium"]]
    _game = Game(scenes=scenes[:1], fps=FPS) # load just first level for now 
    
    status = get_status(_game)
    status.update({
        "won" : False,
        "fail" : False,
        "message" : "",
        "level_i" :  0,
        "n_levels" : len(scenes),
        "scores" : [0,0,0],
        "total_score" : 0,
    })
    
    # Save session
    save_game_db(id, scenes)
    session["scene_init_info"] = {
        "init_orbits" : _game.scenes[0].initial_orbit_pos,
        "sc_start_pos" : _game.scenes[0].sc_start_pos
    }
    session["game_info"] = {
        "level_i" : 0,
        "n_levels" : len(scenes),
        "total_score" : 0
    }

    return status
