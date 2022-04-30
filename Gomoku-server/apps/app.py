from flask import Flask
from flask import Flask, jsonify
from flask import abort
from flask import request
from flask_cors import *

import yaml
import json
import sys
import os
sys.path.append("..")

from apps.utils import run 

# model
from AIPlayer import Game

app = Flask(__name__)
app_config = {"host": "127.0.0.1", "port": "5000"}

# allow cors
CORS(app, supports_credentials=True)
imgs = []

with open(sys.path[0] + "/../configs/Global-Config.yaml", 'r') as fp:
    global_cfg = yaml.load(fp.read(), Loader=yaml.Loader)

model1 = global_cfg["model1_path"]
model2 = global_cfg["model2_path"]

# this is the API for post models and return the competition result(test)
@app.route('/upload', methods=['POST'])  # results returned from the front-end
def upload_model():
    # load data from request
    data = request.get_json()
    updated_data = json.loads(data["data"]) 
    print(updated_data)
    model1_path = updated_data["model1"]
    model2_path = updated_data["model2"]
    print("model1_path: ", model1_path)
    print("model2_path: ", model2_path)

    # TODO: run two models
    # load the two models and get results
    # res = run(model1_path, model2_path)

    retdata = {
        "status": 200,
        "res": "success"
        }

    # return results to front-end
    return jsonify(retdata)

# TODO: API for starting the game
@app.route('/start', methods=['GET'])  
def start_game():

    # get actions from Ai and update board
    player = Game()
    data_return = player.init_player()

    
    # data to return to the client
    data_dict = {
                    "history_states": data_return[0], 
                    "availables":     data_return[1], 
                    "last_move":      data_return[2]
                }
    print(data_dict)

    return jsonify(data_dict)

# TODO: API for human player
@app.route('/action', methods=['GET'])  
def getData():

    # parse data from client
    history_states = request.args.get("history_states")  
    availables = request.args.get("availables")  
    last_move = request.args.get("last_move")  
    x = request.args.get("x")  
    y = request.args.get("y")  

    # get actions from Ai and update board
    player = Game()
    data_return = player.start_play(history_states, availables, last_move, x, y)

    
    # data to return to the client
    data_dict = {
                    "history_states": data_return[0], 
                    "availables":     data_return[1], 
                    "last_move":      data_return[2], 
                    "x":              data_return[3], 
                    "y":              data_return[4]
                }
    print(data_dict)

    return jsonify(data_dict)


if __name__ == '__main__':
    app.run(**app_config)