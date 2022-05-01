import React from "react";
import ReactDOM from "react-dom";
// import Game from "./Game";

// ReactDOM.render(<Game />, document.getElementById("root"));

// function to judege if wins
export function calculateWinner(y: number, x: number, arr, chessColor) {
  let n1 = 0;
  let n2 = 0;
  let n3 = 0;
  let n4 = 0;

  // from left
  for (let i = x - 1; i >= 0; i--) {
    if (arr[y][i] !== chessColor) {
      break;
    }
    n1++;
  }
  // to right
  for (let i = x + 1; i < 8; i++) {
    if (arr[y][i] !== chessColor) {
      break;
    }
    n1++;
  }


  //up
  for (let i = y - 1; i >= 0; i--) {
    if (arr[i][x] !== chessColor) {
      break;
    }
    n2++;
  }
  // down
  for (let i = y + 1; i < 8; i++) {
    if (arr[i][x] !== chessColor) {
      break;
    }
    n2++;
  }


  // left diag
  for (let i = x - 1, j = y - 1; i >= 0 || j >= 0; i--, j--) {
    if (i < 0 || j < 0 || arr[j][i] !== chessColor) {
      break;
    }
    n3++;
  }
  // right diag
  for (let i = x + 1, j = y + 1; i < 8 || j < 8; i++, j++) {
    if (i >= 8 || j >= 8 || arr[j][i] !== chessColor) {
      break;
    }
    n3++;
  }

  // right up
  for (let i = x - 1, j = y + 1; i >= 0 || j < 8; i--, j++) {
    if (i < 0 || j >= 8 || arr[j][i] !== chessColor) {
      break;
    }
    n4++;
  }

  // left down
  for (let i = x + 1, j = y - 1; i < 8 || j >= 0; i++, j--) {
    if (i >= 8 || j < 0 || arr[j][i] !== chessColor) {
      break;
    }
    n4++;
  }

  if (n1 >= 4 || n2 >= 4 || n3 >= 4 || n4 >= 4) {
    return chessColor;
  }
  return null;
}
