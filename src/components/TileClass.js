export function createTile(idString, piece = "empty") {
  let computedColor = "#7a530d";
  let row = idString.charAt(0);
  let col = idString.charAt(1);
  if ((Number(row) + Number(col)) % 2 === 0) {
    computedColor = "#faeed9";
  }

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
  };
}
