import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { ReactComponent as ModelIcon } from './database-solid.svg';
import { ReactComponent as WebcamIcon } from './webcam-solid.svg';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose'

function App() {
  const webcamFeed = useRef(null)
  const [handRecognitionModel, setHandRecognitionModel] = useState(null)
  const [loadState, setLoadState] = useState({ webcam: false, model: false })
  const [currentNumber, setCurrentNumber] = useState(0)
  const [sequence, setSequence] = useState({ input: [5, 4, 3], user: [] })
  const [authorized, setAuthorized] = useState(null)
  const [validationStart, setValidationStart] = useState(0)
  const loadWebcamAndModel = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        webcamFeed.current.srcObject = stream;
        setLoadState(prev => ({ ...prev, webcam: true }))
        const model = await handpose.load();
        setHandRecognitionModel(model)

      }
      catch (e) {
        console.log("Something went wrong when loading webcam / model!", e);
      }
    }
  }

  const handScan = async () => {
    if (handRecognitionModel) {
      const predictions = await handRecognitionModel.estimateHands(webcamFeed.current);
      setLoadState(prev => ({ ...prev, model: true }))
      if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
          const keypoints = predictions[i].landmarks;
          const annotations = predictions[i].annotations
          // console.log(annotations)
          let total = 0
          const fingers = ['indexFinger', 'middleFinger', 'pinky', 'ringFinger', 'thumb']
          for (const finger of fingers) {
            if (annotations[finger] && annotations[finger][0] && annotations[finger][3] && annotations[finger][0][1] - annotations[finger][3][1] > 0) {
              if (finger === 'thumb') {
                if (Math.abs((annotations[finger][0][0] - annotations[finger][3][0]) / annotations[finger][0][0]) > 0.2) {
                  total++
                }

              } else {
                total++
              }
            }
          }
          setCurrentNumber(total)
          // Log hand keypoints.
          // for (let i = 0; i < keypoints.length; i++) {
          //   const [x, y, z] = keypoints[i];
          //   console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
          // }
        }
      }
      requestAnimationFrame(handScan);
    }
  }

  const singleScan = async () => {
    let total = 0
    if (handRecognitionModel) {
      const predictions = await handRecognitionModel.estimateHands(webcamFeed.current);
      setLoadState(prev => ({ ...prev, model: true }))
      if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
          const keypoints = predictions[i].landmarks;
          const annotations = predictions[i].annotations
          // console.log(annotations)
          const fingers = ['indexFinger', 'middleFinger', 'pinky', 'ringFinger', 'thumb']
          for (const finger of fingers) {
            if (annotations[finger] && annotations[finger][0] && annotations[finger][3] && annotations[finger][0][1] - annotations[finger][3][1] > 0) {
              if (finger === 'thumb') {
                if (Math.abs((annotations[finger][0][0] - annotations[finger][3][0]) / annotations[finger][0][0]) > 0.2) {
                  total++
                }

              } else {
                total++
              }
            }
          }


          // Log hand keypoints.
          // for (let i = 0; i < keypoints.length; i++) {
          //   const [x, y, z] = keypoints[i];
          //   console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
          // }
        }

      }
      setSequence(prev => {
        const updatedSequence = [...prev.user, total]
        console.log(updatedSequence)
        return { ...prev, user: updatedSequence }
      })
    }
    return total
  }

  useEffect(() => {
    loadWebcamAndModel()
  }, [])

  useEffect(() => {
    handScan()
  }, [handRecognitionModel])

  useEffect(() => {
    if (sequence.user.length === sequence.input.length) {
      for (let i = 0; i < sequence.user.length; i++) {
        if (sequence.user[i] !== sequence.input[i]) {
          setAuthorized(false)
          return
        } else {
          setAuthorized(true)
        }
      }
    }

  }, [sequence])

  const checkSequence = () => {
    setSequence(prev => ({ ...prev, user: [] }))
    setAuthorized(null)
    setValidationStart(1)
    let i = 1
    for (const number of sequence.input) {
      setTimeout(() => {
        setValidationStart(prev => (prev + 1))
        singleScan()
      }, 2500 * i)
      i++
    }
  }

  return (
    <div className="App">
      <h1>SHOW ME THE FINGERS! <span>CAPTCHA edition</span></h1>
      <h2>Put your fingers up following the sequence of numbers</h2>
      <div className="video-feed" onClick={checkSequence}>
        <video ref={webcamFeed} autoPlay />
        {loadState.model && <h2 className="current-number">{currentNumber}</h2>}
      </div>
      {authorized === null &&
        <div className="sequence">
          <p className={validationStart >= 1 ? 'show' : 'hidden'}>5</p>
          <p className={validationStart >= 2 ? 'show' : 'hidden'}>4</p>
          <p className={validationStart >= 3 ? 'show' : 'hidden'}>3</p>
        </div>
      }
      {authorized && <p className="result success">ACCESS GRANTED</p>}
      {authorized === false && <p className="result fail">ACCESS DENIED, PLEASE TRY AGAIN</p>}
      <section className="status">
        <h2 className={loadState.webcam ? 'loaded' : 'loading'}><WebcamIcon className="svg-icon" /></h2>
        <h2 className={loadState.model ? 'loaded' : 'loading'}><ModelIcon className="svg-icon" /></h2>
      </section>

    </div>
  );
}

export default App;
