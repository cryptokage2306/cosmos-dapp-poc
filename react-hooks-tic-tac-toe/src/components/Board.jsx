import React from "react";
import Square from "./Square";

export default ({ squares, onClick, nextMove, nought, zero, account, isWinner }) => {
  function renderSquare(val, i, j) {
    return (
      <Square
        className={`square`}
        key={i + j}
        value={val == null ? "" : val ? "X" : "0"}
        onClick={() => onClick(i, j)}
        isNotDisabled={nextMove ? nought == account : zero == account}
        isWinner={isWinner}
      />
    );
  }
  let boardSize = 3;
  let boardSquares = [];
  for (let i = 0; i < boardSize; i++) {
    let squaresInRow = [];
    for (let n = 0; n < boardSize; n++) {
      squaresInRow.push(renderSquare(squares[i][n], i, n));
    }
    boardSquares.push(
      <div key={i} className="board-row">
        {squaresInRow}
      </div>
    );
  }
  return <React.Fragment>{boardSquares}</React.Fragment>;
};
