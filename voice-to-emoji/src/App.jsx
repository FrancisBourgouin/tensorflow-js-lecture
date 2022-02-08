import { useState } from "react";
import listen from "./helpers/voiceHelpers";

import "./App.css";

function App() {
  const labels = ["💤💤💤", "☕", "🌒🧛‍♀️", "🎃", "🤖", "🔥🍞🔥", "💚🧘‍♀️💚"];
  const [biggestIndex, setBiggestIndex] = useState(0);

  return (
    <div className="App">
      <header>
        <h1>SUPER VOICE TO EMOJI YEAH</h1>
      </header>
      <button onClick={() => listen(setBiggestIndex)}>LISTEN</button>
      <i style={{ display: "block", fontSize: 70, fontStyle: "normal" }}>
        {labels[biggestIndex]}
      </i>
    </div>
  );
}

export default App;
