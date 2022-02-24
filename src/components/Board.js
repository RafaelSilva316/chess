import React, { useEffect, useState } from "react";
import Tile from "./Tile";
import { createBoard } from "./BoardClass";

const deepCopy = (arr) => {
  let copy = [];
  arr.forEach((elem) => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem));
    } else {
      if (typeof elem === "object") {
        copy.push(deepCopyObject(elem));
      } else {
        copy.push(elem);
      }
    }
  });
  return copy;
}; // Helper function to deal with Objects

const deepCopyObject = (obj) => {
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === "object") {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value;
      }
    }
  }
  return tempObj;
};

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
  const [CheckMate, setCheckMate] = useState(false);

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

  const deriveTileFromId = (id) => {
    let r = Number(id.charAt(0));
    let c = Number(id.charAt(1));
    return [r - 1, c - 1];
  };

  const findKing = (clr, board) => {
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
    return kingTile;
  };

  const isKingInCheck = (clr, board) => {
    let kingTile = findKing(clr, board);
    const potKingAttackers = kingTile.canBeAttacked(board) || [];
    const trueKingAttackers = potKingAttackers.filter((pieceObj) => {
      return pieceObj.color !== clr;
    });
    return trueKingAttackers;
  };

  const findTrueAttackers = (currTile, attackerColor) => {
    let listOfAttackers = currTile.canBeAttacked(board);
    let trueAttackers;
    if (listOfAttackers) {
      trueAttackers = listOfAttackers.filter((attacker) => {
        return attacker.color === attackerColor;
      });
    } else {
      trueAttackers = [];
    }

    return trueAttackers;
  };

  const oppColor = (clr) => {
    if (clr === "white") {
      return "black";
    } else {
      return "white";
    }
  };

  const canAvoid = (kingTile) => {
    let [r, c] = deriveTileFromId(kingTile.idString);
    let tempRow;
    let tempCol;
    let potTiles = [];
    let opposite = oppColor(kingTile.piece.color);
    let openTiles = [];

    //find tiles around king
    for (let i = 0; i < 3; i++) {
      tempRow = r - 1 + i;
      // console.log(tempRow);
      for (let j = 0; j < 3; j++) {
        tempCol = c - 1 + j;
        // console.log(tempRow);
        if (!(tempRow === r && tempCol === c)) {
          potTiles.push([tempRow, tempCol]);
        }
      }
    }

    //check if each tile is in the board, is open, and is not under attack
    for (let k = 0; k < potTiles.length; k++) {
      let newTempR = potTiles[k][0];
      let newTempC = potTiles[k][1];
      if (newTempR > 0 && newTempR < 8 && newTempC > 0 && newTempC < 8) {
        if (board[newTempR][newTempC].piece === "empty") {
          let tileAttackers = findTrueAttackers(
            board[newTempR][newTempC],
            opposite
          );
          if (tileAttackers.length === 0) {
            openTiles.push(newTempR, newTempC);
          }
        }
      }
    }

    if (openTiles.length > 0) {
      return openTiles;
    }

    return false;
  };

  const canBlock = (kingTile) => {
    let opposite = oppColor(kingTile.piece.color);
    let kingAttackers = findTrueAttackers(kingTile, opposite);
    let deltaR;
    let deltaC;
    if (kingAttackers.length !== 1) {
      return false;
    }
    if (kingAttackers[0].type === "knight") {
      return false;
    }
    let [kingR, kingC] = deriveTileFromId(kingTile.idString);
    let [attackerR, attackerC] = deriveTileFromId(kingAttackers[0].idString);

    //start from kings perspective and branch out
    if (kingR > attackerR) {
      deltaR = -1;
    } else if (kingR < attackerR) {
      deltaR = 1;
    } else {
      deltaR = 0;
    }

    if (kingC > attackerC) {
      deltaC = -1;
    } else if (kingC < attackerC) {
      deltaC = 1;
    } else {
      deltaC = 0;
    }

    let distanceR = Math.abs(kingR - attackerR);
    let distanceC = Math.abs(kingC - attackerC);
    let greaterDistance;
    if (distanceR > distanceC) {
      greaterDistance = distanceR;
    } else {
      greaterDistance = distanceC;
    }

    for (let i = 1; i < greaterDistance; i++) {
      let currTile = board[kingR + i * deltaR][kingC + i * deltaC];
      let potentialBlockers = findTrueAttackers(currTile, kingTile.piece.color);
      if (potentialBlockers.length > 0) {
        for (let piece of potentialBlockers) {
          if (piece.type === "pawn") {
            let [pawnR, pawnC] = deriveTileFromId(piece.idString);
            // console.log(pawnC);
            // console.log(kingC + i * deltaC);
            if (pawnC === kingC + i * deltaC) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      //check if pawn can move to spot
      if (kingTile.piece.color === "white" && kingR + i * deltaR < 7) {
        let underCurrTile = board[kingR + i * deltaR + 1][kingC + i * deltaC];
        if (underCurrTile.piece.type === "pawn") {
          return true;
        }
      }
      if (kingTile.piece.color === "black" && kingR + i * deltaR > 0) {
        let underCurrTile = board[kingR + i * deltaR - 1][kingC + i * deltaC];
        if (underCurrTile.piece.type === "pawn") {
          return true;
        }
      }
    }
    return false;
  };

  const canCapture = (kingTile) => {
    let opposite = oppColor(kingTile.piece.color);
    let kingAttackers = findTrueAttackers(kingTile, opposite);
    if (kingAttackers.length === 0) {
      return true;
    }
    if (kingAttackers.length > 1) {
      return false;
    } else {
      let [attackerR, attackerC] = deriveTileFromId(kingAttackers[0].idString);
      let attackerCapturers = findTrueAttackers(
        board[attackerR][attackerC],
        kingTile.piece.color
      );
      if (attackerCapturers.length > 0) {
        console.log(attackerCapturers);
        //make copy of board,

        for (let capturer of attackerCapturers) {
          console.log(capturer);
          const fakeBoard = deepCopy(board);
          let [capturerR, capturerC] = deriveTileFromId(capturer.idString);
          fakeBoard[capturerR][capturerC].removePiece();
          fakeBoard[attackerR][attackerC].removePiece();
          let kingIsInCheck =
            isKingInCheck(kingTile.piece.color, fakeBoard).length > 0;
          console.log({ kingIsInCheck });
          if (!kingIsInCheck) {
            return true;
          }
        }
        return false;
      }
    }
  };

  const isCheckMate = (board) => {
    let check;
    // console.log("in ischeckmate");
    if (turn === "white") {
      check = whiteCheck;
    } else {
      check = blackCheck;
    }
    //remove
    // check = true;
    if (check) {
      let kingTile = findKing(turn, board);
      let piecesAttacking = isKingInCheck(turn, board);
      if (!canAvoid(kingTile) && !canBlock(kingTile) && !canCapture(kingTile)) {
        return true;
      }
    }
    return false;
  };

  // console.log(isCheckMate(board));

  useEffect(() => {
    let isWhiteKingChecked = isKingInCheck("white", board).length > 0;
    setWhiteCheck(isWhiteKingChecked);
    let isBlackKingChecked = isKingInCheck("black", board).length > 0;
    setBlackCheck(isBlackKingChecked);
  }, [board]);

  useEffect(() => {
    let isKingCheckMate = isCheckMate(board);
    console.log(isCheckMate(board));
    console.log(isKingCheckMate);
    setCheckMate(isKingCheckMate);
  }, [whiteCheck, blackCheck]);

  return (
    <>
      <h1>{turn}</h1>
      <h1>White King in Check: {whiteCheck ? "yes" : "no"}</h1>
      <h1>Black King in Check: {blackCheck ? "yes" : "no"}</h1>
      <h1>CheckMate? {CheckMate ? "yes" : "no"}</h1>
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
