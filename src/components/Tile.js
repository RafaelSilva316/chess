import React from "react";

function Tile(props) {
  const handleDragStart = async (e) => {
    await props.setCurrentPiece(props.piece);
    await props.setPrevTile(props.r, props.c);
    props.tile.removePiece();
  };

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let nextR;
    let nextC;
    let occupied = true;
    let occupiedSame = false;

    if (props.piece === "empty") {
      occupied = false;
    } else {
      if (props.dragging.color === props.piece.color) {
        occupiedSame = true;
      }
    }

    if (
      props.isMoveValid(
        props.r,
        props.c,
        props.prevR,
        props.prevC,
        occupied,
        props.dragging.color,
        occupiedSame
      )
    ) {
      nextR = props.r;
      nextC = props.c;
    } else {
      nextR = props.prevR;
      nextC = props.prevC;
    }

    props.addPieceToBoard(nextR, nextC);
    props.clearCurrentPiece();
  };

  return (
    <div
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
      className="Tile"
      style={
        (props.r + props.c) % 2 === 0
          ? { backgroundColor: "#faeed9" }
          : { backgroundColor: "#7a530d" }
      }
    >
      {props.r} {props.c}
      {props.piece !== "empty" && (
        <div
          draggable="true"
          className="draggable-piece"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${props.piece.imgUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
      )}
    </div>
  );
}

export default Tile;
