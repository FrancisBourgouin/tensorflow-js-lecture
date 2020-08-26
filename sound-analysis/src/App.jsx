import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import UIfx from 'uifx'
import bassDrumSource from './sound/bass-drum.wav'
import snareDrumSource from './sound/snare-drum.wav'
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands'



const URL = "http://localhost:3000/my_model/";

function App() {
  const [bassDrum, setBassDrum] = useState()
  const [snareDrum, setSnareDrum] = useState()
  const [recognizerModel, setRecognizerModel] = useState()
  const [sequence, setSequence] = useState([null, "bass", "bass", "snare", null, "snare", null, "bass", "bass", "snare", "bass"])

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

    return recognizer
  }

  async function init() {
    const recognizer = await createModel();

    setRecognizerModel(recognizer)
  }

  const listen = async () => {
    const currentSequence = []
    const classLabels = recognizerModel.wordLabels(); // get class labels
    console.log(classLabels)
    recognizerModel.listen(result => {
      const scores = result.scores;
      // console.log(scores, result)
      const bgNoiseLabel = classLabels[0]
      const clapNoiseLabel = classLabels[1]
      const snapNoiseLabel = classLabels[2]

      const bgNoise = scores[0]
      const clapNoise = scores[1]
      const snapNoise = scores[2]

      const noises = {}
      classLabels.forEach((label, index) => {
        noises[label] = scores[index]
      })
      console.log(noises)
      if (clapNoise > 0.6) {
        currentSequence.push('bass')
      }
      else if (snapNoise > 0.6) {
        currentSequence.push('snare')
      }
      else {
        currentSequence.push('bg')
      }
    },

      {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
      });

    // Stop the recognition in 5 seconds.
    setTimeout(() => {
      recognizerModel.stopListening()
      console.log(currentSequence)
      setSequence(currentSequence)
    }, 10000);
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const bass = new UIfx(
      bassDrumSource,
      {
        volume: 0.8, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    )
    const snare = new UIfx(
      snareDrumSource,
      {
        volume: 0.8, // number between 0.0 ~ 1.0
        throttleMs: 100
      }
    )

    setBassDrum(bass)
    setSnareDrum(snare)
  }, [])

  const play = () => {
    sequence.forEach((instrument, index) => {
      setTimeout(() => {
        if (instrument === "bass") {
          bassDrum.play()
        }
        if (instrument === "snare") {
          snareDrum.play()
        }
      }, 150 * index)
    })
  }
  return (
    <div className="App" >
      <button onClick={() => bassDrum?.play()}>CLICK ME</button>
      <button onClick={() => snareDrum?.play()}>CLICK ME</button>
      <button onClick={() => listen()}>NAVI: LISTEN</button>
      <button onClick={play}>PLAY</button>
    </div>
  );
}

export default App;
