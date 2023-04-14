import { useState } from "react";
import "./App.css";
import { DemoGrid } from "./components/Grid";

function App() {
  const [rowHeight, setRowHeight] = useState(25);

  return (
    <div className="App">
      <h1>Viewport Params Recyling Issue</h1>
      <button
        onClick={() => {
          setRowHeight(50);
        }}
      >
        Row Height 50
      </button>
      <button
        onClick={() => {
          setRowHeight(25);
        }}
      >
        Row Height 25
      </button>

      <pre>{JSON.stringify({ rowHeight }, null, 4)}</pre>

      <DemoGrid rowHeight={rowHeight} />
    </div>
  );
}

export default App;
