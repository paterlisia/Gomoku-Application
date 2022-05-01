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
  const [winner, setWinner] = useState(false);

  const handleBoard = (humany: number, humanx: number, AIy: number, AIx: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    console.log("newBoard:", typeof newBoard);
    console.log("newboard:", newBoard); // latest board
    console.log("第 24 行的 newBoard[y][x]:", newBoard[humany][humanx]);
    // if human wins
    const humanWin = calculateWinner(
      humany,
      humanx,
      newBoard,
      newBoard[humany][humanx]
    )
    if (humanWin ||
      newBoard[humany][humanx] !== null // cannot set duplicate
    ) {
      setWinner(humanWin);
      return;
    }
    // human move update
    newBoard[humany][humanx] =  "⚫" ;
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
      return;
    }

    // AI move update

    newBoard[AIy][AIx] =  "⚪";

    setBoard(newBoard);
    console.log("new board:", newBoard);
    console.log("last move", newBoard[humany][humanx]);
    console.log("player", typeof newBoard[1][1]);
    console.log("white?", whiteIsNext);
    setWhiteIsNext(!whiteIsNext);
  }

  const handleClick = (y: number, x: number) => {

    // set AI change
    getModelAction(x, y)
  };

  // send GET request to backend to get the model action
  const getModelAction = (humanx: number, humany: number) => {

    // call API to get model decision
    const service = new ModelService();
    console.log(available);
    const rsp = service.getAction({
      history_states: historyStates,
      availables:     available,
      last_move:      lastMove,
      x:              humanx,
      y:              humany
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
