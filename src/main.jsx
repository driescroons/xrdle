import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { useStore } from "./store";

function Overlay() {
  const reset = useStore((store) => store.reset);
  return (
    <div
      style={{ position: "fixed", color: "white", zIndex: 1, padding: "10px" }}
    >
      <h1>XRDLE</h1>
      <span>A shittier version of Wordle, but in VR.</span>
      <br />
      <span>
        Play the original version of{" "}
        <a href="https://www.powerlanguage.co.uk/wordle">Wordle here</a>.
      </span>
      <br />
      <span>
        Want to get into WebXR development? Checkout the{" "}
        <a href="https://github.com/driescroons/xrdle">source here</a>.
      </span>
      <br />
      <br />
      <div>
        <button
          onClick={() => {
            reset();
          }}
        >
          Reset puzzle
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Overlay />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
