# EECE E6892-final-project Gomoku application based on AlphaZero
Final Project of EECE E6892@Columbia University  
author: Xiaotian Geng, Jing Peng

## Brief introduction of our project
Our project will implement AlphaZero algorithm in playing a board game Gomoku. Furthermore, we will explore the influence of different factors like numbers of training iterations,
model architecture, numbers of simulated games and calculation of Upper Confidence Bound(UCB) have on our trained AI model. And we will realize this by comparing the winnining percentage by changing different factors.

## Description of code  
- Gomoku-client: Front-end of the whole project.
- Gomoku-server: Back-end of the whole project.
    - PVKeras: Code implementation of model built by Keras. They are original 3-layer model, 4-layer CNN model, 4-layer RNN model, and Resnet-18 model.  
    - GomokuBoard Used to generate gomoku board and visualize the board.
    - PVPytorch: Code implementation of model built by Pytorch.  
    - model: files of trained models
    - play.py: this file is used to do AI vs AI Gomoku Competition and explore winning strategy.  
    - train.py: this file is used to train models.  

## Related docs
-  __DeepMind's paper on AlphaZero__: _{Silver, David, et al. "A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play." Science 362.6419 (2018): 1140-1144._
- __Alphago__: _Silver, David, et al. "Mastering the game of Go with deep neural networks and tree search." nature 529.7587 (2016): 484-489._
- __Alphago Zero__: _Silver, David, et al. "Mastering the game of go without human knowledge." nature 550.7676 (2017): 354-359._
- __DeepMind published a new paper detailing MuZero, a new algorithm able to generalise on AlphaZero work, playing both Atari and board games without knowledge of the rules or representations of the game__: _Schrittwieser, Julian, et al. "Mastering atari, go, chess and shogi by planning with a learned model." Nature 588.7839 (2020): 604-609._
- __Comparision with other Monte Carlo tree search searches and training__: _Silver, David, et al. "Mastering chess and shogi by self-play with a general reinforcement learning algorithm." arXiv preprint arXiv:1712.01815 (2017)._