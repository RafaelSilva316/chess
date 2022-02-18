import { useState } from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  const [gameMode, setGameMode] = useState("play");

  return (
    <div className="App">
      <button
        onClick={() => {
          setGameMode("analysis");
        }}
      >
        Analysis Mode
      </button>
      <button
        onClick={() => {
          setGameMode("play");
        }}
      >
        Play Game
      </button>
      <h1>{gameMode}</h1>
      <Board gameMode={gameMode} />
    </div>
  );
}

export default App;
