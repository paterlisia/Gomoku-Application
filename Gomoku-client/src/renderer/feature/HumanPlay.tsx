import "./board.css";
import { React, useState } from "react";
import { calculateWinner } from "./helper";

// service to call api
import ModelService from '../utils/ModelService';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board() {
  const [board, setBoard] = useState(Array(19).fill(Array(19).fill(null)));
  const [available, setAvailable] = useState([]);
  const [historyStates, setHistoryStates] = useState({});
  const [lastMove, setLastMove] = useState(-1);
  const [whiteIsNext, setWhiteIsNext] = useState(true);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  const handleBoard = (y, x) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    console.log("newBoard:", typeof newBoard);
    console.log("newboard:", newBoard); // latest board
    console.log("第 24 行的 newBoard[y][x]:", newBoard[y][x]);

    if (
      calculateWinner(
        position.y,
        position.x,
        newBoard,
        newBoard[position.y][position.x]
      ) ||
      newBoard[y][x] !== null // cannot set duplicate
    ) {
      return;
    }
    newBoard[y][x] = whiteIsNext ? "⚫" : "⚪";

    const positionX = x;
    const positionY = y;

    setPosition({
      x: positionX,
      y: positionY
    });

    setBoard(newBoard);
    console.log("new board:", newBoard);
    console.log("last move", newBoard[y][x]);
    console.log("player", typeof newBoard[1][1]);
    console.log("white?", whiteIsNext);
  }

  const handleClick = (y, x) => {
    // set human change
    handleBoard(y, x);

    setWhiteIsNext(!whiteIsNext);
    // set AI change
    getModelAction(x, y)
  };

  // send GET request to backend to get the model action
  const getModelAction = (x, y) => {

    // call API to get model decision
    const service = new ModelService();
    console.log(available);
    const rsp = service.getAction({
      history_states: historyStates,
      availables:     available,
      last_move:      lastMove,
      x:              x,
      y:              y
  });
    console.log('waiting for AI to decide...');

    rsp
      .then((response) => {
        console.log('res:', response);
        const { history_states, availables, last_move, x, y } = response.data;

        console.log('history_states:', history_states);
        console.log('availables:', history_states);
        console.log('last_move:', history_states);

        // set corresponding state in hooks
        setAvailable(availables);
        setHistoryStates(history_states);
        setLastMove(last_move);

        // AI move
        handleBoard(x, y)
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

  function renderSquare(j, i) {
    return <Square value={board[j][i]} onClick={() => handleClick(j, i)} />;
  }

  const winner = calculateWinner(
    position.y,
    position.x,
    board,
    board[position.y][position.x]
  );

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = "Next player: " + (whiteIsNext ? "⚫" : "⚪");
  }

  return (
    <div>
      {board.map((y, columnIndex) => {
        return (
          <div className="board-row" key={columnIndex}>
            {board.map((x, rowIndex) => renderSquare(columnIndex, rowIndex))}
          </div>
        );
      })}
      <div className="status">
        <div>{status}</div>
        <button
          type="button"
          onClick={() => startPlay()}
        >
          Start
        </button>
        <button
          type="button"
          class="btn btn-dark"
          value="reload"
          onClick={() => window.location.reload()}
        >
          Restart
        </button>
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
