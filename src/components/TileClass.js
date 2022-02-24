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
    let end;
    let colDelta;
    let rowDelta;
    let potAttackers = [];
    let pawnAttackColor = "black";
    let pawnAttackPossible = false;

    if (dir === "up") {
      expression = row > 0;
      end = row + 1;
      rowDelta = -1;
      colDelta = 0;
      potAttackers.push("rook", "queen");
    }

    if (dir === "down") {
      expression = row < 7;
      end = 8 - row;
      rowDelta = 1;
      colDelta = 0;
      potAttackers.push("rook", "queen");
    }

    if (dir === "left") {
      expression = col > 0;
      end = col + 1;
      rowDelta = 0;
      colDelta = -1;
      potAttackers.push("rook", "queen");
    }

    if (dir === "right") {
      expression = col < 7;
      end = 8 - col;
      rowDelta = 0;
      colDelta = 1;
      potAttackers.push("rook", "queen");
    }

    if (dir === "upright") {
      expression = col < 7 && row > 0;

      end = Math.min(8 - col, row + 1);
      rowDelta = -1;
      colDelta = 1;
      potAttackers.push("bishop", "queen");
      pawnAttackPossible = true;
    }

    if (dir === "downright") {
      expression = col < 7 && row < 7;
      end = Math.min(8 - col, 8 - row);
      rowDelta = 1;
      colDelta = 1;
      potAttackers.push("bishop", "queen");
      pawnAttackPossible = true;
      pawnAttackColor = "white";
    }

    if (dir === "downleft") {
      expression = col > 0 && row < 7;
      end = Math.min(col + 1, 8 - row);
      rowDelta = 1;
      colDelta = -1;
      potAttackers.push("bishop", "queen");
      pawnAttackPossible = true;
      pawnAttackColor = "white";
    }

    if (dir === "upleft") {
      expression = col > 0 && row > 0;
      end = Math.min(col + 1, row + 1);
      rowDelta = -1;
      colDelta = -1;
      potAttackers.push("bishop", "queen");
      pawnAttackPossible = true;
    }

    if (expression) {
      if (board[row + 1 * rowDelta][col + 1 * colDelta].piece === "king") {
        return board[row + 1 * rowDelta][col + 1 * colDelta];
      } else if (pawnAttackPossible) {
        if (
          board[row + 1 * rowDelta][col + 1 * colDelta].piece.type === "pawn"
        ) {
          if (
            board[row + 1 * rowDelta][col + 1 * colDelta].piece.color ===
            pawnAttackColor
          ) {
            return board[row + 1 * rowDelta][col + 1 * colDelta];
          }
        }
      }
      for (let i = 1; i < end; i++) {
        let currTile = board[row + i * rowDelta][col + i * colDelta];

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
  };

  const checkKnightAttacks = (board) => {
    let coordsToCheck = [];
    let allKnightMoves = [];
    let knightAttackers = [];

    allKnightMoves.push([row - 1, col - 2]);
    allKnightMoves.push([row + 1, col - 2]);

    allKnightMoves.push([row - 2, col - 1]);
    allKnightMoves.push([row - 2, col + 1]);

    allKnightMoves.push([row - 1, col + 2]);
    allKnightMoves.push([row + 1, col + 2]);

    allKnightMoves.push([row + 2, col - 1]);
    allKnightMoves.push([row + 2, col + 1]);

    for (let i = 0; i < allKnightMoves.length; i++) {
      if (
        allKnightMoves[i][0] >= 0 &&
        allKnightMoves[i][1] >= 0 &&
        allKnightMoves[i][0] <= 7 &&
        allKnightMoves[i][1] <= 7
      ) {
        coordsToCheck.push(allKnightMoves[i]);
      }
    }

    for (let j = 0; j < coordsToCheck.length; j++) {
      let r = coordsToCheck[j][0];
      let c = coordsToCheck[j][1];
      if (board[r][c].piece !== "empty") {
        if (board[r][c].piece.type === "knight") {
          knightAttackers.push(board[r][c]);
        }
      }
    }

    return knightAttackers;
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
      let knightAttackTiles = checkKnightAttacks(board);

      addIfExists(checkDirection(board, "up"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "down"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "left"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "right"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "upright"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "upleft"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "downright"), potentialAttackerTiles);
      addIfExists(checkDirection(board, "downleft"), potentialAttackerTiles);

      if (knightAttackTiles.length > 0) {
        potentialAttackerTiles.push(...knightAttackTiles);
      }

      if (potentialAttackerTiles.length === 0) {
        return false;
      }
      let potentialAttackerPieces = potentialAttackerTiles.map((tile) => {
        return {
          type: tile.piece.type,
          color: tile.piece.color,
          idString: tile.idString,
        };
      });

      return potentialAttackerPieces;
    },
  };
}
