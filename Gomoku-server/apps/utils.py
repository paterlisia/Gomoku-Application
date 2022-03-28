import glob
import multiprocessing as mp
import numpy as np
import os
import sys
import tempfile
import time
import warnings
import cv2
import tqdm

# game board
from game import Game
from GomokuBoard.board import Board
from mcts_alphaZero import MCTSPlayer

# pytorch net
from PVPytorch.policy_value_net_pytorch import PolicyValueNet  # Pytorch

sys.path.append("..")
from apps.predictor import VisualizationHelper

class PredictionCase:
    def __init__(self, img_path, pred_class, score, pred_box, height, width):
        self.url = img_path
        self.category = pred_class
        self.confidence = score
        self.bbox = pred_box
        self.height = height
        self.width = width

    def get_url(self):
        return self.url

    def get_category(self):
        return self.category

    def get_confidence(self):
        return self.confidence

    def get_bbox(self):
        return self.bbox

    def get_height(self):
        return self.height

    def get_width(self):
        return self.width

    def __str__(self):
        return "<Object: " + COCO_CATEGORIES[self.category]["name"] + ";\n"\
                          + "score: " + str(self.confidence) + ";\n"\
                          + "bbox: " + str(self.bbox) + ">\n"

    def __repr__(self):
        return "<Object: " + COCO_CATEGORIES[self.category]["name"] + ";\n" \
                          + "score: " + str(self.confidence) + ";\n" \
                          + "bbox: " + str(self.bbox) + ">\n"


def loadModel(cfg, model):
    cfg.MODEL.WEIGHTS = model
    cfg.freeze()

def predImages(imgs, vis, name):
    preds = []

    for img in imgs:
        data = read_image(img, "BGR")
        start_time = time.time()

        height = int(data.shape[0])
        width = int(data.shape[1])
        scalar = max(width, height)
        height = int(height / scalar * 256)
        width = int(width / scalar * 256)
        dim = (width, height)
        data = cv2.resize(data, dim, interpolation = cv2.INTER_AREA)

        predictions, visualized_output = vis.run_on_image(data)

        img_label = img.split("/")[-1]
        img_label = img_label.split(".")[0]
        img_label = sys.path[0] + "/../users/%s/data/" % name + img_label + '.jpeg'
        # print(img_label)
        # cv2.namedWindow("WINDOW_NAME", cv2.WINDOW_NORMAL)
        # cv2.imshow("WINDOW_NAME", visualized_output.get_image()[:, :, ::-1])
        # if cv2.waitKey(0) == 27:
        #     break  # esc to quit
        cv2.imwrite(img_label, data)

        # img: url of the image
        preds.append(([img_label, height, width], predictions))

        logger = setup_logger()
        logger.info(
            "{}: {} in {:.2f}s".format(
                img,
                "detected {} instances".format(len(predictions["instances"]))
                if "instances" in predictions
                else "finished",
                time.time() - start_time,
            )
        )

    return preds


def getPredResult(preds):
    if(len(preds) == 0):
        return None

    res = []

    for pred in preds:
        img_path = pred[0][0]
        height = pred[0][1]
        width = pred[0][2]

        if len(pred[1]["instances"]) == 0:
            print("here")
            predCase = PredictionCase(img_path, -1, -1.0, [-1.0, -1.0, -1.0, -1.0], height, width)
            tmp = [predCase]
            res.append(tmp)
            continue

        instances = pred[1]["instances"]

        num_targets = len(instances)
        img_size = instances._image_size
        height, width = img_size[0], img_size[1]

        pred_boxes   = instances.get("pred_boxes")
        scores       = instances.get("scores")
        pred_classes = instances.get("pred_classes")

        tmp = []

        for i in range(num_targets):
            pred_class = pred_classes[i].item()
            score = scores[i].item()

            x1 = pred_boxes.tensor[i, 0].clamp(min=0, max=width).item()
            y1 = pred_boxes.tensor[i, 1].clamp(min=0, max=height).item()
            x2 = pred_boxes.tensor[i, 2].clamp(min=0, max=width).item()
            y2 = pred_boxes.tensor[i, 3].clamp(min=0, max=height).item()
            pred_box = [int(x1), int(y1), int(x2), int(y2)]

            print("Object " + COCO_CATEGORIES[pred_class]["name"] \
                            + " with score of " + str(score) \
                            + " in " + str(pred_box))

            predCase = PredictionCase(img_path, pred_class, score, pred_box, height, width)
            tmp.append(predCase)

        res.append(tmp)

    return res


def run(model1, model2):

    # play kind
    n = 5
    width, height = 8, 8
    
    try:
        board = Board(width=width, height=height, n_in_row=n)
        game = Game(board)

        # ############### two models competition ###################
        # load the trained policy_value_net with PyTorch

        # load player1 with model1
        best_policy1 = PolicyValueNet(width, height, model_file = model1)
        mcts_player1 = MCTSPlayer(best_policy1.policy_value_fn, c_puct=5, n_playout=400)


        # load player2 with model2
        best_policy2 = PolicyValueNet(width, height, model_file = model2)
        mcts_player2 = MCTSPlayer(best_policy2.policy_value_fn, c_puct=5, n_playout=400)

        res = game.start_play(mcts_player1, mcts_player2, start_player=0, is_shown=1)
    except KeyboardInterrupt:
        print('\n\rquit')

    print(res)

    return res


# if __name__ == "__main__":
#     imgs = ["../cache/WechatIMG512.jpeg"]
#     model = sys.path[0] + "/../models/model_final34.pth"
#     config_file = sys.path[0] + "/../configs/COCO-Detection/faster_rcnn_R_34_FPN_3x.yaml"

#     res = run(imgs, model, config_file)