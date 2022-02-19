import React, { useState } from "react";
import Tile from "./Tile";
import { createBoard } from "./BoardClass";

const initBoard = createBoard();
initBoard.initPieces();

function Board(props) {
  const [dragging, setDragging] = useState(false);
  const [board, setBoard] = useState(initBoard.board);
  const [turn, setTurn] = useState("white");
  const [prevR, setPrevR] = useState(0);
  const [prevC, setPrevC] = useState(0);

  const toggleTurn = () => {
    setTurn((prevTurn) => {
      if (prevTurn === "white") {
        return "black";
      }
      return "white";
    });
  };

  const setPrevTile = (r, c) => {
    setPrevR(r);
    setPrevC(c);
  };

  const isCorrectTurn = () => {
    if (turn === dragging.color) {
      return true;
    }
    return false;
  };

  const isValidPieceMove = (r1, c1, r2, c2, occupied, color) => {
    // console.log(dragging);
    // console.log(dragging.canMove(r1, c1, r2, c2, occupied, color));
    // console.log(dragging.pathNotBlocked(r1, c1, r2, c2, board));
    return (
      dragging.canMove(r1, c1, r2, c2, occupied, color) &&
      dragging.pathNotBlocked(r1, c1, r2, c2, board)
    );
    // return true;
  };

  const isMoveValid = (r1, c1, r2, c2, occupied, color, occupiedSame) => {
    if (props.gameMode === "analysis") {
      return true;
    }
    //isCorrectTurn() && validPieceMove() && notInCheck()
    // console.log(isValidPieceMove(r1, c1, r2, c2, occupied, color));
    if (
      isCorrectTurn() &&
      isValidPieceMove(r1, c1, r2, c2, occupied, color) &&
      !occupiedSame
    ) {
      toggleTurn();
      return true;
    }
    return false;
  };

  const setCurrentPiece = (piece) => {
    setDragging(piece);
  };

  const clearCurrentPiece = (piece) => {
    setDragging(false);
  };

  const addPieceToBoard = (r, c) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[r][c].placePiece(dragging);
      return newBoard;
    });
  };

  return (
    <>
      <h1>{turn}</h1>
      <h1>tile 3 3</h1>
      <h1>
        {board[3][3].piece === "empty" ? "empty" : board[3][3].piece.type}
      </h1>
      <h1>{board[3][3].canBeAttacked(board) === false ? "safe" : "danger"}</h1>
      <div className="Board draggable-piece">
        {board.map((row, rowIndex) => {
          return row.map((tile, colIndex) => {
            return (
              <Tile
                gameMode={props.gameMode}
                clearCurrentPiece={clearCurrentPiece}
                setCurrentPiece={setCurrentPiece}
                setPrevTile={setPrevTile}
                addPieceToBoard={addPieceToBoard}
                dragging={dragging}
                tile={tile}
                id={tile.idString}
                r={rowIndex}
                c={colIndex}
                key={tile.idString}
                piece={tile.piece}
                isMoveValid={isMoveValid}
                prevR={prevR}
                prevC={prevC}
              />
            );
          });
        })}
      </div>
    </>
  );
}

export default Board;
