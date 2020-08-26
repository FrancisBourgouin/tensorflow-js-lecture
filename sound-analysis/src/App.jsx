import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import UIfx from 'uifx'
import bassDrumSource from './sound/bass-drum.wav'
import snareDrumSource from './sound/snare-drum.wav'
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands'



const URL = "http://localhost:3000/base_model/";

function App() {
  const [bassDrum, setBassDrum] = useState()
  const [snareDrum, setSnareDrum] = useState()
  const [recognizerModel, setRecognizerModel] = useState()
  const [sequence, setSequence] = useState([])

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

  const listen = () => {
    let bgNoise = 0
    let bassNoise = 0
    let snareNoise = 0
    recognizerModel.listen(result => {
      const scores = result.scores;

      bgNoise = scores[0]
      bassNoise = scores[1]
      snareNoise = scores[2]

      console.log(scores)
    })
    setTimeout(() => {
      recognizerModel.stopListening()
      console.log(bgNoise, bassNoise, snareNoise)
      let output = ""
      if (snareNoise > bassNoise && snareNoise > bgNoise) {
        output = "snare"
      }
      else if (bassNoise > snareNoise && bassNoise > bgNoise) {
        output = "bass"
      }
      else {
        output = "bg"
      }
      setSequence(prev => [...prev, output])
    }, 1500)
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
      }, 300 * index)
    })
  }

  const removeLast = () => {
    const updatedSequence = [...sequence]
    updatedSequence.pop()
    setSequence(updatedSequence)
  }
  return (
    <div className="App" >
      <h1>🎵🎶🎵 Voice to drum track ! 🎶🎵🎶</h1>
      <section>
        <button onClick={() => bassDrum?.play()}>🥁 Bass Drum 🎵</button>
        <button onClick={() => snareDrum?.play()}>🎵 Snare Drum 🥁</button>
      </section>
      <h3>
        🎼({sequence.length % 4 + 1} / 4) : {sequence.map(sound => <span>{sound}</span>)}
      </h3>
      <section>
        <button onClick={listen}>👂 & Add</button>
        <button onClick={removeLast}>Remove last 🥁</button>
        <button onClick={play}>PLAY</button>
      </section>
    </div>
  );
}

export default App;
