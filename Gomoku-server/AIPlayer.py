# -*- coding: utf-8 -*-
"""

"""

from __future__ import print_function
import os
from posixpath import abspath
import numpy as np


from AIBoard import Board

from mcts_alphaZero import MCTSPlayer
from PVPytorch.policy_value_net_pytorch import PolicyValueNet  # Pytorch

class Game(object):
    """game server"""

    def __init__(self, board=None, **kwargs):
        n = 5
        width, height = 8, 8
        self.board = Board(width, height, n)

    # init for starting the game
    def init_player(self):
        self.board.init_board()
        return self.board.states, self.board.availables, self.board.last_move

    def graphic(self, board, player1, player2):
        """Draw the board and show game info"""
        width = board.width
        height = board.height

        print("Player", player1, "with X".rjust(3))
        print("Player", player2, "with O".rjust(3))
        print()
        for x in range(width):
            print("{0:8}".format(x), end='')
        print('\r\n')
        for i in range(height - 1, -1, -1):
            print("{0:4d}".format(i), end='')
            for j in range(width):
                loc = i * width + j
                p = board.states.get(loc, -1)
                if p == player1:
                    print('X'.center(8), end='')
                elif p == player2:
                    print('O'.center(8), end='')
                else:
                    print('_'.center(8), end='')
            print('\r\n\r\n')

    def start_play(self, history_states, availables, last_move, x, y):
        """continue or start a game between two players"""

        n = 5
        width, height = 8, 8
        cwd = os.getcwd()  # Get the current working directory (cwd)
        files = os.listdir(cwd)  # Get all the files in that directory
        print("Files in %r: %s" % (cwd, files))
        # model file here
        model_file = '../model/PytorchCheckpoint-1399.pth'

        # the new or history board
        self.board = Board(width , height, n, states=history_states)
        self.board.init_board(availables=availables, last_move=last_move)
            
        # load the trained policy_value_net with PyTorch
        best_policy = PolicyValueNet(width, height, model_file = model_file)
        mcts_player = MCTSPlayer(best_policy.policy_value_fn, c_puct=5, n_playout=400)

        # self.board.init_board(start_player)
        # p1, p2 = self.board.players
        # player1.set_player_ind(p1)
        # player2.set_player_ind(p2)
        # players = {p1: player1, p2: player2}
        # if is_shown:
        #     self.graphic(self.board, player1.player, player2.player)

        # update human play with board
        self.human_update_board(x, y)

        # get ai actions and update the board
        h, w = self.get_model_action(mcts_player)

        return h, w, self.board.states, self.board.availables, self.board.last_move


    # human move from the client
    def human_update_board(self, x, y):
        location = (x, y)
        if isinstance(location, str):  # for python3
            location = [int(n, 10) for n in location.split(",")]
        #  calculate move steps from the input
        move = self.board.location_to_move(location)

        # update board
        self.board.do_move(move)
        

    # get model actions based on current board
    def get_model_action(self, AIPlayer):
        # get current player
        # current_player = self.board.get_current_player()

        # p1 for ai and p2 for human
        # p1, p2 = self.board.players
        # players = {p1: player1, p2: player2}
        # player = players[current_player]  # player object(Human)

        # calculate AI move steps
        move = AIPlayer.get_action(self.board)
        # print("current AIPlayer:", AIPlayer)

        # transfer to coodinate
        h = move // 8
        w = move % 8
        print("move:", h, w)
        
        # update board
        self.board.do_move(move)

        return h, w
        # if is_shown:
        #     self.graphic(self.board, AIPlayer1.AIPlayer, AIPlayer2.AIPlayer)
        # end, winner = self.board.game_end()
        # if end:
        #     if is_shown:
        #         if winner != -1:
        #             print("Game end. Winner is", players[winner])
        #         else:
        #             print("Game end. Tie")
        #     return winner
    
    def start_self_play(self, player, is_shown=0, temp=1e-3):
        """ start a self-play game using a MCTS player, reuse the search tree,
        and store the self-play data: (state, mcts_probs, z) for training
        """
        self.board.init_board()
        p1, p2 = self.board.players
        states, mcts_probs, current_players = [], [], []
        while True:
            move, move_probs = player.get_action(self.board,
                                                 temp=temp,
                                                 return_prob=1)
            # store the data
            states.append(self.board.current_state())
            mcts_probs.append(move_probs)
            current_players.append(self.board.current_player)
            # perform a move
            self.board.do_move(move)
            if is_shown:
                self.graphic(self.board, p1, p2)
            end, winner = self.board.game_end()
            if end:
                # winner from the perspective of the current player of each state
                winners_z = np.zeros(len(current_players))
                if winner != -1:
                    winners_z[np.array(current_players) == winner] = 1.0
                    winners_z[np.array(current_players) != winner] = -1.0
                # reset MCTS root node
                player.reset_player()
                if is_shown:
                    if winner != -1:
                        print("Game end. Winner is player:", winner)
                    else:
                        print("Game end. Tie")
                return winner, zip(states, mcts_probs, winners_z)
