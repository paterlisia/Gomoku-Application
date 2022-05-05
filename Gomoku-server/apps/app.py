from flask import Flask
from flask import Flask, jsonify
from flask import abort
from flask import request
from flask_cors import *

import yaml
import json
import sys
import numpy as np
sys.path.append("..")

# from apps.utils import run 

# model
from AIPlayer import Game

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.int64):
            return int(obj)
        if isinstance(obj, np.float64):
            return float(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

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
@app.route('/action', methods=['POST'])  
def getData():
    # parse json data from post request
    data = request.get_json() 
    # parse data from client
    history_states = data["history_states"]
    availables = data["availables"]
    last_move = data["last_move"]
    x = data["x"]
    y = data["y"]
    mode = data["mode"]
    states_int = {}
    for key in history_states:
        states_int[int(key)] = history_states[key]
    print("history_states", states_int)
    print("availables", availables)
    print("last_move", last_move)
    print("mode", mode)
    # get actions from Ai and update board
    player = Game()
    data_return = player.start_play(states_int, availables, last_move, x, y, mode)

    print(data_return[4], type(data_return[4]))
    # convert numpy int64 to int for stringfy
    available_str = {}
    for key in data_return[2]:
        available_str[int(key)] = int(data_return[2][key])
    # data to return to the client
    data_dict = {
                    "history_states": available_str, 
                    "availables":     data_return[3], 
                    "last_move":      int(data_return[4]), 
                    "x":              int(data_return[0]), 
                    "y":              int(data_return[1]),
                    "winner":         data_return[5]
                }
    print(data_dict)
    # available_str = json.dumps(data_return[2], cls=NpEncoder)
    # print(type(available_str))
    # data_dict = json.dumps(data_dict, cls=NpEncoder)
    return jsonify(data_dict)




if __name__ == '__main__':
    app.run(**app_config)