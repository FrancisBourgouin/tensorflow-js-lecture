import React from 'react';
import * as tf from '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'
import './App.css';

const URL = "http://localhost:3000/bass_model/";
function App() {

  async function createModel() {
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


    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
        const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
        console.log(classLabels[i], classPrediction);
      }
    }, {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
  }
  return (
    <div className="App" >
      <h1>Sound</h1>
      <button onClick={init}>START LISTENING</button>
    </div>
  );
}

export default App;
