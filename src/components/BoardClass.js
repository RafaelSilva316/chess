import { createTile } from "./TileClass";
import { createPiece } from "./PieceClass";
export function createBoard() {
  const board = [];
  for (let i = 1; i < 9; i++) {
    const row = [];
    for (let j = 1; j < 9; j++) {
      let idString = i.toString() + j.toString();
      const newTile = createTile(idString);
      row.push(newTile);
    }
    board.push(row);
  }
  return {
    board,
    initPieces: function () {
      const lwRook = createPiece("white", "rook");
      const rwRook = createPiece("white", "rook");
      const lbRook = createPiece("black", "rook");
      const rbRook = createPiece("black", "rook");

      const lwKnight = createPiece("white", "knight");
      const rwKnight = createPiece("white", "knight");
      const lbKnight = createPiece("black", "knight");
      const rbKnight = createPiece("black", "knight");

      const lwBishop = createPiece("white", "bishop");
      const rwBishop = createPiece("white", "bishop");
      const lbBishop = createPiece("black", "bishop");
      const rbBishop = createPiece("black", "bishop");

      const wQueen = createPiece("white", "queen");
      const bQueen = createPiece("black", "queen");
      const wKing = createPiece("white", "king");
      const bKing = createPiece("black", "king");

      for (let i = 0; i < 8; i++) {
        let bp = createPiece("black", "pawn");
        board[1][i].placePiece(bp);
        let wp = createPiece("white", "pawn");
        board[6][i].placePiece(wp);
      }

      board[7][0].placePiece(lwRook);
      board[7][7].placePiece(rwRook);
      board[0][0].placePiece(lbRook);
      board[0][7].placePiece(rbRook);

      board[7][1].placePiece(lwKnight);
      board[7][6].placePiece(rwKnight);
      board[0][1].placePiece(lbKnight);
      board[0][6].placePiece(rbKnight);

      board[7][2].placePiece(lwBishop);
      board[7][5].placePiece(rwBishop);
      board[0][2].placePiece(lbBishop);
      board[0][5].placePiece(rbBishop);

      board[7][3].placePiece(wQueen);
      board[0][3].placePiece(bQueen);
      board[7][4].placePiece(wKing);
      board[0][4].placePiece(bKing);
    },
  };
}
