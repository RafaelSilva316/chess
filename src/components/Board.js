import React, { useEffect, useState } from "react";
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
  const [whiteCheck, setWhiteCheck] = useState(false);
  const [blackCheck, setBlackCheck] = useState(false);

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
    return (
      dragging.canMove(r1, c1, r2, c2, occupied, color) &&
      dragging.pathNotBlocked(r1, c1, r2, c2, board)
    );
  };

  const isMoveValid = (
    r1,
    c1,
    r2,
    c2,
    occupied,
    color,
    occupiedSame,
    checked
  ) => {
    if (props.gameMode === "analysis") {
      return true;
    }

    if (
      isCorrectTurn() &&
      isValidPieceMove(r1, c1, r2, c2, occupied, color) &&
      !occupiedSame &&
      !checked
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

  // const deriveTileFromId = (id) => {
  //   let r = Number(id.charAt(0));
  //   let c = Number(id.charAt(1));
  //   return [r - 1, c - 1];
  // };

  const isKingInCheck = (clr, board) => {
    let kingTile;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          board[i][j].piece.type === "king" &&
          board[i][j].piece.color === clr
        ) {
          kingTile = board[i][j];
        }
      }
    }
    const potKingAttackers = kingTile.canBeAttacked(board) || [];
    const trueKingAttackers = potKingAttackers.filter((pieceObj) => {
      return pieceObj.color !== clr;
    });
    return trueKingAttackers;
  };

  useEffect(() => {
    let isWhiteKingChecked = isKingInCheck("white", board).length > 0;
    setWhiteCheck(isWhiteKingChecked);
    let isBlackKingChecked = isKingInCheck("black", board).length > 0;
    setBlackCheck(isBlackKingChecked);
  }, [board]);

  return (
    <>
      <h1>{turn}</h1>
      <h1>White King in Check: {whiteCheck ? "yes" : "no"}</h1>
      <h1>Black King in Check: {blackCheck ? "yes" : "no"}</h1>
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
                whiteCheck={whiteCheck}
                blackCheck={blackCheck}
                board={board}
                isKingInCheck={isKingInCheck}
              />
            );
          });
        })}
      </div>
    </>
  );
}

export default Board;
