export function createTile(idString, piece = "empty") {
  let computedColor = "#7a530d";
  let idrow = idString.charAt(0);
  let idcol = idString.charAt(1);
  let row = idrow - 1;
  let col = idcol - 1;
  if ((Number(idrow) + Number(idcol)) % 2 === 0) {
    computedColor = "#faeed9";
  }

  const checkDirection = (board, dir) => {
    let expression;
    let start;
    let end;
    let colDelta;
    let rowDelta;
    let potAttackers = [];

    console.log({ row, col });
    if (dir === "up") {
      expression = row > 0;
      start = row - 1;
      end = row + 1;
      rowDelta = -1;
      colDelta = 0;
      potAttackers.push("rook", "queen");
    }

    if (dir === "down") {
      expression = row < 7;
      start = row + 1;
      end = 8 - row;
      rowDelta = 1;
      colDelta = 0;
      potAttackers.push("rook", "queen");
    }

    if (dir === "left") {
      expression = col > 0;
      start = col - 1;
      end = col + 1;
      rowDelta = 0;
      colDelta = -1;
      potAttackers.push("rook", "queen");
    }

    if (dir === "right") {
      expression = col < 7;
      start = col + 1;
      end = 8 - col;
      rowDelta = 0;
      colDelta = 1;
      potAttackers.push("rook", "queen");
    }

    if (dir === "upright") {
      expression = col < 7 && row > 0;
      start = col + 1;
      end = Math.min(8 - col, row + 1);
      rowDelta = -1;
      colDelta = 1;
      potAttackers.push("bishop", "queen");
    }

    if (dir === "downright") {
      expression = col < 7 && row < 7;
      start = col + 1;
      end = Math.min(8 - col, 8 - row);
      rowDelta = 1;
      colDelta = 1;
      potAttackers.push("bishop", "queen");
    }

    if (dir === "downleft") {
      expression = col > 0 && row < 7;
      start = col - 1;
      end = Math.min(col + 1, 8 - row);
      rowDelta = 1;
      colDelta = -1;
      potAttackers.push("bishop", "queen");
    }

    if (dir === "upleft") {
      expression = col > 0 && row > 0;
      start = col - 1;
      end = Math.min(col + 1, row + 1);
      rowDelta = -1;
      colDelta = -1;
      potAttackers.push("bishop", "queen");
    }

    if (expression) {
      if (board[start][col].piece === "king") {
        return board[start][col];
      } else {
        for (let i = 1; i < end; i++) {
          let currTile = board[row + i * rowDelta][col + i * colDelta];
          // console.log(row + i * rowDelta, col + i * colDelta);
          if (
            currTile.piece.type === potAttackers[0] ||
            currTile.piece.type === potAttackers[1]
          ) {
            return currTile;
          }
          if (currTile.piece !== "empty") {
            return false;
          }
        }
      }
    }
  };

  const addIfExists = function (element, array) {
    if (element) {
      array.push(element);
    }
  };

  return {
    idString,
    piece,
    color: computedColor,
    placePiece: function (pieceName) {
      this.piece = pieceName;
    },
    removePiece: function () {
      this.piece = "empty";
    },
    isOccupied: function () {
      if (this.piece === "empty") {
        return false;
      }
      return true;
    },
    canBeAttacked: function (board) {
      let potentialAttackerTiles = [];

      addIfExists(checkDirection(board, "up"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "down"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "left"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "right"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "upright"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "upleft"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "downright"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "downleft"), potentialAttackerTiles);

      if (potentialAttackerTiles.length === 0) {
        return false;
      }
      let potentialAttackerPieces = potentialAttackerTiles.map((tile) => {
        return [tile.piece.type, tile.piece.color];
      });
      console.log(potentialAttackerPieces);
      return potentialAttackerTiles;

      //check down
      //check left
      //check right
      //check diagonals
      //check knight attacks
    },
  };
}
