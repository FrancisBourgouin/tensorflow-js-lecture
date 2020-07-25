import React, { useState } from 'react';
import Face from './Face'
import Fingers from './Fingers'
import Home from './Home'
import Intro from './Intro'
import './App.scss';

const App = () => {
  const [view, setView] = useState('Intro')
  return (
    <div className="App">
      {view === "Intro" && <Intro setView={setView} />}
      {view === "Home" && <Home setView={setView} />}
      {view === "Face" && <Face setView={setView} />}
      {view === "Fingers" && <Fingers setView={setView} />}
    </div>
  );
}

export default App;
