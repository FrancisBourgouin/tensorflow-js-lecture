import React from 'react';
import logo from './logo.svg';
import { ReactComponent as ReactLogo } from './logo.svg';
import './App.css';
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands'


function App() {
  const [logoPosition, setLogoPosition] = useState([50, 50])
  const parsedPosition = { top: `${logoPosition[0]}%`, left: `${logoPosition[1]}%` }
  async function createModel() {
    const URL = "http://localhost:3000/model/";
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
  }

  async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels


    recognizer.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      console.log(scores)
      for (let i = 0; i < classLabels.length; i++) {
        const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
        // _background_noise_: 0.86
        // App.jsx:41 down: 0.11
        // App.jsx:41 left: 0.00
        // App.jsx:41 move: 0.01
        // App.jsx:41 much: 0.01
        // App.jsx:41 right: 0.00
        // App.jsx:41 select: 0.00
        // App.jsx:41 up: 0.00

        if (scores[i] > 0.9) {
          switch (classLabels[i]) {
            case 'up':
              setLogoPosition([logoPosition[0], logoPosition[1] + 5])
              break;
            case 'down':
              setLogoPosition([logoPosition[0], logoPosition[1] - 5])
              break;
            case 'left':
              setLogoPosition([logoPosition[0] - 5, logoPosition[1]])
              break;
            case 'right':
              setLogoPosition([logoPosition[0] + 5, logoPosition[1]])
              break;
          }
        }

        console.log(classPrediction);
      }
    }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });
  }
  return (
    <div className="App">
      <h1>IMAGE MOVER</h1>
      <button onClick={init}>Start listening!</button>
      <ReactLogo className="App-logo" style={parsedPosition} />
    </div>
  );
}

export default App;
