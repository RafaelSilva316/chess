import blackBishopImg from "../img/bishop-black.png";
import whiteBishopImg from "../img/bishop-white.png";

import blackKingImg from "../img/king-black.png";
import whiteKingImg from "../img/king-white.png";

import blackQueenImg from "../img/queen-black.png";
import whiteQueenImg from "../img/queen-white.png";

import blackKnightImg from "../img/knight-black.png";
import whiteKnightImg from "../img/knight-white.png";

import blackPawnImg from "../img/pawn-black.png";
import whitePawnImg from "../img/pawn-white.png";

import blackRookImg from "../img/rook-black.png";
import whiteRookImg from "../img/rook-white.png";

const pieceTypes = {
  king: {
    white: whiteKingImg,
    black: blackKingImg,
    canMove: function (prevX, prevY, nextX, nextY) {
      if (
        (Math.abs(nextX - prevX) === 1 && Math.abs(nextY - prevY) <= 1) ||
        (Math.abs(nextY - prevY) === 1 && Math.abs(nextX - prevX) <= 1)
      ) {
        return true;
      }
      return false;
    },
    pathNotBlocked: function (nextX, nextY, prevX, prevY, board) {
      return true;
    },
  },

  rook: {
    white: whiteRookImg,
    black: blackRookImg,
    canMove: function (prevX, prevY, nextX, nextY) {
      if (
        (Math.abs(nextX - prevX) === 0 && Math.abs(nextY - prevY) > 0) ||
        (Math.abs(nextY - prevY) === 0 && Math.abs(nextX - prevX) > 0)
      ) {
        return true;
      }
      return false;
    },
    pathNotBlocked: function (nextY, nextX, prevY, prevX, board) {
      // find dir
      let deltaY = Math.abs(nextY - prevY);
      let deltaX = Math.abs(nextX - prevX);
      let dir;

      if (nextX - prevX === 0) {
        if (nextY > prevY) {
          dir = "down";
        } else {
          dir = "up";
        }
      } else {
        if (nextX > prevX) {
          dir = "right";
        } else {
          dir = "left";
        }
      }

      if (dir === "up") {
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "down") {
        for (let i = 1; i < deltaY; i++) {
          console.log(`nextY-i ${nextY - i}`);
          if (board[nextY - i][prevX].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "left") {
        for (let i = 1; i < deltaX; i++) {
          if (board[prevY][prevX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "right") {
        for (let i = 1; i < deltaX; i++) {
          if (board[prevY][nextX - i].piece !== "empty") {
            return false;
          }
        }
      }

      return true;
    },
  },

  knight: {
    white: whiteKnightImg,
    black: blackKnightImg,
    canMove: function (prevX, prevY, nextX, nextY) {
      if (
        (Math.abs(nextX - prevX) === 2 && Math.abs(nextY - prevY) === 1) ||
        (Math.abs(nextY - prevY) === 2 && Math.abs(nextX - prevX) === 1)
      ) {
        return true;
      }
      return false;
    },
    pathNotBlocked: function (nextX, nextY, prevX, prevY, board) {
      return true;
    },
  },

  bishop: {
    white: whiteBishopImg,
    black: blackBishopImg,
    canMove: function (prevX, prevY, nextX, nextY) {
      if (
        Math.abs(nextX - prevX) === Math.abs(nextY - prevY) &&
        Math.abs(nextY - prevY) !== 0
      ) {
        return true;
      }
      return false;
    },
    pathNotBlocked: function (nextY, nextX, prevY, prevX, board) {
      // find dir
      let deltaY = Math.abs(nextY - prevY);
      let deltaX = Math.abs(nextX - prevX);
      let dir;

      if (nextX > prevX) {
        if (nextY > prevY) {
          dir = "downright";
        } else {
          dir = "upright";
        }
      } else {
        if (nextY > prevY) {
          dir = "downleft";
        } else {
          dir = "upleft";
        }
      }

      if (dir === "downright") {
        for (let i = 1; i < deltaY; i++) {
          if (board[nextY - i][nextX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "upright") {
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX + i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "upleft") {
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "downleft") {
        for (let i = 1; i < deltaY; i++) {
          if (board[nextY - i][nextX + i].piece !== "empty") {
            return false;
          }
        }
      }

      return true;
    },
  },

  queen: {
    white: whiteQueenImg,
    black: blackQueenImg,
    canMove: function (prevX, prevY, nextX, nextY) {
      if (
        (Math.abs(nextX - prevX) === Math.abs(nextY - prevY) &&
          Math.abs(nextY - prevY) !== 0) ||
        (Math.abs(nextX - prevX) === 0 && Math.abs(nextY - prevY) > 0) ||
        (Math.abs(nextY - prevY) === 0 && Math.abs(nextX - prevX) > 0)
      ) {
        return true;
      }
      return false;
    },
    pathNotBlocked: function (nextY, nextX, prevY, prevX, board) {
      let deltaY = Math.abs(nextY - prevY);
      let deltaX = Math.abs(nextX - prevX);
      let dir;

      // console.log(
      //   `nextY: ${nextY}, nextX: ${nextX} prevY: ${prevY} prevX: ${prevX}`
      // );

      if (nextX - prevX === 0) {
        if (nextY > prevY) {
          dir = "down";
        } else {
          dir = "up";
        }
      } else if (nextY - prevY === 0) {
        if (nextX > prevX) {
          dir = "right";
        } else {
          dir = "left";
        }
      } else if (nextX > prevX) {
        if (nextY > prevY) {
          dir = "downright";
        } else {
          dir = "upright";
        }
      } else {
        if (nextY > prevY) {
          dir = "downleft";
        } else {
          dir = "upleft";
        }
      }
      // console.log(dir);
      if (dir === "up") {
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "down") {
        for (let i = 1; i < deltaY; i++) {
          if (board[nextY - i][prevX].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "left") {
        for (let i = 1; i < deltaX; i++) {
          if (board[prevY][prevX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "right") {
        for (let i = 1; i < deltaX; i++) {
          if (board[prevY][nextX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "downright") {
        for (let i = 1; i < deltaY; i++) {
          if (board[nextY - i][nextX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "upright") {
        // console.log({ deltaY });
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX + i].piece !== "empty") {
            // console.log(`${prevY - i} ${nextX - i}`);
            return false;
          }
        }
      }

      if (dir === "upleft") {
        for (let i = 1; i < deltaY; i++) {
          if (board[prevY - i][prevX - i].piece !== "empty") {
            return false;
          }
        }
      }

      if (dir === "downleft") {
        for (let i = 1; i < deltaY; i++) {
          if (board[nextY - i][nextX + i].piece !== "empty") {
            return false;
          }
        }
      }

      return true;
    },
  },

  pawn: {
    white: whitePawnImg,
    black: blackPawnImg,
    canMove: function (
      nextY,
      nextX,
      prevY,
      prevX,
      nextTileOccupied,
      pawnColor
    ) {
      let deltaX = Math.abs(nextX - prevX);
      // let deltaY = Math.abs(nextY - prevY);
      let deltaY;
      if (pawnColor === "black") {
        deltaY = nextY - prevY;
      } else {
        deltaY = prevY - nextY;
      }

      if (!nextTileOccupied) {
        //one forward to unoccupied tile
        if (deltaY === 1 && deltaX === 0) {
          return true;
        }
        //two fwd if at row1 or row7
        if (prevY === 1 || prevY === 6) {
          if (deltaY === 2 && deltaX === 0) {
            return true;
          }
        }
      }
      //if tile occupied
      else {
        if (deltaX === 1 && deltaY === 1) {
          return true;
        }
      }
      //TODO insert en passant here

      return false;
    },
    pathNotBlocked: function (nextX, nextY, prevX, prevY, board) {
      return true;
    },
  },
};

export function createPiece(color, type) {
  return {
    color,
    type,
    imgUrl: pieceTypes[type][color],
    canMove: pieceTypes[type].canMove,
    pathNotBlocked: pieceTypes[type].pathNotBlocked,
  };
}
