import React from "react";
import Square from "./Square";
import { toast } from "react-toastify";

export default ({
  squares,
  onClick,
  nextMove,
  cross,
  nought,
  account,
  isWinner,
}) => {
  function renderSquare(val, i, j) {
    return (
      <Square
        className={`square`}
        key={i + j}
        value={val == null ? "" : val ? "X" : "0"}
        onClick={() => {
          try {
            if (nextMove) {
              if (nought === account) throw new Error("This is Cross move");
            } else {
              if (cross === account) throw new Error("This is Zero move");
            }

            onClick(i, j);
          } catch (err) {
            toast.error(err.message);
          }
        }}
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
