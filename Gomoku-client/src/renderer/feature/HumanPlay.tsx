import "./board.css";
import { React, useState } from "react";
import { calculateWinner } from "./helper";

import { Divider } from 'antd';

// service to call api
import ModelService from '../utils/ModelService';

// ui framework from antd
import { Button, message } from 'antd';
import { CheckOutlined, UndoOutlined } from '@ant-design/icons';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board() {
  const [board, setBoard] = useState(Array(8).fill(Array(8).fill(null)));
  const [available, setAvailable] = useState([]);
  const [historyStates, setHistoryStates] = useState({});
  const [lastMove, setLastMove] = useState(-1);
  const [whiteIsNext, setWhiteIsNext] = useState(true);
  const [winner, setWinner] = useState(false);

  const handleBoard = (humany: number, humanx: number, AIy: number, AIx: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    console.log("newBoard:", typeof newBoard);
    console.log("newboard:", newBoard); // latest board
    console.log("第 24 行的 newBoard[y][x]:", newBoard[humany][humanx]);
    // if human wins
    // const humanWin = calculateWinner(
    //   humany,
    //   humanx,
    //   newBoard,
    //   newBoard[humany][humanx]
    // )
    // if (humanWin ||
    //   newBoard[humany][humanx] !== null // cannot set duplicate
    // ) {
    //   setWinner(humanWin);
    //   return;
    // }
    // human move update
    newBoard[humany][humanx] = "⚫";
    // if AI wins
    const AIWin = calculateWinner(
      AIy,
      AIx,
      newBoard,
      newBoard[AIy][AIx]
    )
    if (
      AIWin ||
      newBoard[AIy][AIx] !== null // cannot set duplicate
    ) {
      setWinner(AIWin);
      AIWinEvent();
      return;
    }

    // AI move update

    newBoard[AIy][AIx] = "⚪";

    setBoard(newBoard);
    console.log("new board:", newBoard);
    console.log("last move", newBoard[humany][humanx]);
    console.log("player", typeof newBoard[1][1]);
    console.log("white?", whiteIsNext);
    setWhiteIsNext(!whiteIsNext);
  }

  const ifEnd = (y: number, x: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    console.log("newBoard:", typeof newBoard);
    console.log("newboard:", newBoard); // latest board
    console.log("第 24 行的 newBoard[y][x]:", newBoard[y][x]);
    // if human wins
    const win = calculateWinner(
      y,
      x,
      newBoard,
      newBoard[x][x]
    )
    if (win ||
      newBoard[y][x] !== null // cannot set duplicate
    ) {
      setWinner(win);
      return true;
    }
  }

  const handleClick = (y: number, x: number) => {
    // if the game ends
    if (ifEnd(y, x)) {
      console.log("win~");
      humanWinEvent();
      return;
    }
    // set AI change
    getModelAction(x, y);
  };

  // send GET request to backend to get the model action
  const getModelAction = (humanx: number, humany: number) => {

    // call API to get model decision
    const service = new ModelService();
    console.log(available);
    const rsp = service.getAction({
      history_states: historyStates,
      availables: available,
      last_move: lastMove,
      x: humanx,
      y: humany
    });
    console.log('waiting for AI to decide...');

    rsp
      .then((response) => {
        console.log('res:', response);
        const { history_states, availables, last_move, x, y, winner } = response.data;

        console.log('history_states:', history_states);
        console.log('availables:', history_states);
        console.log('last_move:', history_states);
        console.log('winner:', winner);
        if (winner == 2) {
          AIWinEvent();
          return;
        } else if (winner == 1) {
          humanWinEvent();
          return;
        }


        // set corresponding state in hooks
        setAvailable(availables);
        setHistoryStates(history_states);
        setLastMove(last_move);

        // AI move
        handleBoard(humany, humanx, y, x)
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // start play game
  const startPlay = () => {
    // call API to get model decision
    const service = new ModelService();
    const rsp = service.startPlay();
    console.log('waiting for AI to decide...');

    rsp
      .then((response) => {
        const { availables, history_states, last_move } = response.data;
        console.log('availables:', availables);
        console.log('history_states:', history_states);
        console.log('last_move:', last_move);

        // set corresponding state in hooks
        setAvailable(availables);
        setHistoryStates(history_states);
        setLastMove(last_move);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // when human wins
  const humanWinEvent = () => {
    message.success('You win the game!');
  };

  // when human wins
  const AIWinEvent = () => {
    message.error('You lose, can try again!');
  };

  function renderSquare(j, i) {
    return <Square value={board[j][i]} onClick={() => handleClick(j, i)} />;
  }

  // const winner = calculateWinner(
  //   position.y,
  //   position.x,
  //   board,
  //   board[position.y][position.x]
  // );

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = "Next player: " + (whiteIsNext ? "⚫" : "⚪");
  }

  return (
    <div className="board">
      <Divider plain>Mode</Divider>
      {board.map((y, columnIndex) => {
        return (
          <div className="board-row" key={columnIndex}>
            {board.map((x, rowIndex) => renderSquare(columnIndex, rowIndex))}
          </div>
        );
      })}
      <div className="status">
        <div>{status}</div>
        <Button
            // type="primary"
            shape="round"
            icon={<CheckOutlined />}
            size="large"
            onClick={() => startPlay()}
            color="#597ef7"
            >

          Start
        </Button>

        <Button
            // type="primary"
            shape="round"
            icon={<UndoOutlined />}
            size="large"
            onClick={() => () => window.location.reload()}
            >
            Restart
        </Button>
        {/* <button
          type="button"
          onClick={() => startPlay()}
        >
          Start
        </button> */}
        {/* <button
          type="button"
          class="btn btn-dark"
          value="reload"
          onClick={() => window.location.reload()}
        >
          Restart
        </button> */}
      </div>
    </div>
  );
}

function HumanPlay() {

  return (
    <div className="gameBoard">
      <h1>Gomoku</h1>
      <Board />
    </div>
  );
}

export default HumanPlay;
