import "./board.css";
import { React, useState } from "react";
import { calculateWinner } from "./helper";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board() {
  const [board, setBoard] = useState(Array(19).fill(Array(19).fill(null)));
  const [whiteIsNext, setWhiteIsNext] = useState(true);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  const handleClick = (y, x) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    console.log("newBoard:", typeof newBoard);
    console.log("第 23 行的 newBoard:", newBoard); // 這邊的 newBoard 也是有存取到最新的棋盤
    console.log("第 24 行的 newBoard[y][x]:", newBoard[y][x]); // 想知道為何這邊的值會是 null

    if (
      calculateWinner(
        position.y,
        position.x,
        newBoard,
        newBoard[position.y][position.x]
      ) ||
      newBoard[y][x] !== null // 如果該位置已有子就不能再下
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
    console.log("第 48 行，在 setBoard 樓下的 newBoard", newBoard);
    console.log("第 49 行，在 setBoard 樓下的 newBoard[y][x]", newBoard[y][x]);
    console.log("newBoard[y][x]", typeof newBoard[1][1]);

    setWhiteIsNext(!whiteIsNext);
  };

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
