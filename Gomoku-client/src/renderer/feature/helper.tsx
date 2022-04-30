import React from "react";
import ReactDOM from "react-dom";
// import Game from "./Game";

// ReactDOM.render(<Game />, document.getElementById("root"));

// 勝利條件
export function calculateWinner(y, x, arr, chessColor) {
  let n1 = 0;
  let n2 = 0;
  let n3 = 0;
  let n4 = 0;

  // 左右
  // 往左找
  for (let i = x - 1; i >= 0; i--) {
    if (arr[y][i] !== chessColor) {
      break;
    }
    n1++;
  }
  // 往右找
  for (let i = x + 1; i < 19; i++) {
    if (arr[y][i] !== chessColor) {
      break;
    }
    n1++;
  }

  // 上下

  //往上找
  for (let i = y - 1; i >= 0; i--) {
    if (arr[i][x] !== chessColor) {
      break;
    }
    n2++;
  }
  // 往下找
  for (let i = y + 1; i < 19; i++) {
    if (arr[i][x] !== chessColor) {
      break;
    }
    n2++;
  }

  //左上右下

  // 左上
  for (let i = x - 1, j = y - 1; i >= 0 || j >= 0; i--, j--) {
    if (i < 0 || j < 0 || arr[j][i] !== chessColor) {
      break;
    }
    n3++;
  }
  // 右下
  for (let i = x + 1, j = y + 1; i < 19 || j < 19; i++, j++) {
    if (i >= 19 || j >= 19 || arr[j][i] !== chessColor) {
      break;
    }
    n3++;
  }
  // 右上左下
  // 右上
  for (let i = x - 1, j = y + 1; i >= 0 || j < 19; i--, j++) {
    if (i < 0 || j >= 19 || arr[j][i] !== chessColor) {
      break;
    }
    n4++;
  }

  // 左下
  for (let i = x + 1, j = y - 1; i < 19 || j >= 0; i++, j--) {
    if (i >= 19 || j < 0 || arr[j][i] !== chessColor) {
      break;
    }
    n4++;
  }

  if (n1 >= 4 || n2 >= 4 || n3 >= 4 || n4 >= 4) {
    return chessColor;
  }
  return null;
}
