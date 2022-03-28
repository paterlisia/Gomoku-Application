from flask import Flask
from flask import Flask, jsonify
from flask import abort
from flask import request

import yaml
import json
import sys
import os
sys.path.append("..")

from apps.utils import run 

app = Flask(__name__)
app_config = {"host": "127.0.0.1", "port": "5000"}

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


# TODO: API for human player
@app.route('/get', methods=['GET'])  
def getData():
    url = request.args.get("url")  
    imgs = []
    imgs.append(url)

    cases = run(imgs, url)

    case_dict = {"url": url}
    print(case_dict)

    return jsonify(case_dict)


if __name__ == '__main__':
    app.run(**app_config)