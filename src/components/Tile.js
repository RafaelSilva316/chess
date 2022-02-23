import React from "react";

// set up a function that iterates through a given array
// if one of the elements is an array, call itself with that element
// (Edited)
// if elements of the array is an object, we make sure to take care of that too.
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

    //get king out of check?
    let kingIsInCheck = false;
    if (props.dragging.color === "white") {
      kingIsInCheck = props.whiteCheck;
    } else {
      kingIsInCheck = props.blackCheck;
    }
    //create false board
    if (kingIsInCheck) {
      const fakeBoard = deepCopy(props.board);
      fakeBoard[props.r][props.c].placePiece(props.dragging);
      console.log(fakeBoard);
      console.log(props.board);
      kingIsInCheck =
        props.isKingInCheck(props.dragging.color, fakeBoard).length > 0;
    }
    //add piece to false board
    //check if fake king out of check
    console.log(kingIsInCheck);
    if (
      props.isMoveValid(
        props.r,
        props.c,
        props.prevR,
        props.prevC,
        occupied,
        props.dragging.color,
        occupiedSame,
        kingIsInCheck
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
      {/* {props.r} {props.c} */}
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
