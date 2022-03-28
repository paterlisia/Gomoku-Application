
import sys

# game board
from game import Game
from GomokuBoard.board import Board
from mcts_alphaZero import MCTSPlayer

# pytorch net
from PVPytorch.policy_value_net_pytorch import PolicyValueNet  # Pytorch

sys.path.append("..")


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
