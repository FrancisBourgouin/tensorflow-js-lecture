import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { ReactComponent as ModelIcon } from './database-solid.svg';
import { ReactComponent as WebcamIcon } from './webcam-solid.svg';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface'

// [
//   {
//     topLeft: [232.28, 145.26],
//     bottomRight: [449.75, 308.36],
//     probability: [0.998],
//     landmarks: [
//       [295.13, 177.64], // right eye
//       [382.32, 175.56], // left eye
//       [341.18, 205.03], // nose
//       [345.12, 250.61], // mouth
//       [252.76, 211.37], // right ear
//       [431.20, 204.93] // left ear
//     ]
//   }
// ]


function App() {
  const webcamFeed = useRef(null)
  const currentScan = useRef(null)
  const currentMovementX = useRef({ min: 0, max: 0 })
  const currentMovementY = useRef({ min: 0, max: 0 })

  const [faceRecognitionModel, setFaceRecognitionModel] = useState(null)
  const [loadState, setLoadState] = useState({ webcam: false, model: false })
  const [scanResult, setScanResult] = useState(null)

  // Auth mecanism
  const [sequence, setSequence] = useState({ input: ['Vertical', 'Horizontal', 'Vertical'], user: [] })
  const [authorized, setAuthorized] = useState(null)
  const [validationStart, setValidationStart] = useState(0)

  const loadWebcamAndModel = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        webcamFeed.current.srcObject = stream;
        setLoadState(prev => ({ ...prev, webcam: true }))
        const model = await blazeface.load();
        setFaceRecognitionModel(model)
      }
      catch (e) {
        console.log("Something went wrong when loading webcam / model!", e);
      }
    }
  }
  const prepFaceScan = async () => {
    if (faceRecognitionModel) {
      await faceRecognitionModel.estimateFaces(webcamFeed.current);
      setLoadState(prev => ({ ...prev, model: true }))
    }
  }
  const faceScan = async (scanDuration) => {
    if (faceRecognitionModel) {
      const predictions = await faceRecognitionModel.estimateFaces(webcamFeed.current);

      if (predictions.length > 0) {
        const nosePositionX = predictions[0].landmarks[3][0]
        const nosePositionY = predictions[0].landmarks[3][1]

        // console.log(nosePositionX, nosePositionY, currentMovementX.current, currentMovementY.current)
        currentMovementX.current.min = !currentMovementX.current.min || currentMovementX.current.min > nosePositionX ? nosePositionX : currentMovementX.current.min
        currentMovementX.current.max = !currentMovementX.current.max || currentMovementX.current.max < nosePositionX ? nosePositionX : currentMovementX.current.max
        currentMovementY.current.min = !currentMovementY.current.min || currentMovementY.current.min > nosePositionY ? nosePositionY : currentMovementY.current.min
        currentMovementY.current.max = !currentMovementY.current.max || currentMovementY.current.max < nosePositionY ? nosePositionY : currentMovementY.current.max
      }
    }
    currentScan.current = requestAnimationFrame(faceScan);
    setTimeout(() => cancelAnimationFrame(currentScan.current), scanDuration)
  }


  useEffect(() => {
    loadWebcamAndModel()
  }, [])

  useEffect(() => {
    prepFaceScan()
  }, [faceRecognitionModel])

  const singleScan = (position) => {
    setValidationStart(prev => prev + 1)
    console.log('start')
    faceScan(1250)
    setTimeout(() => {
      if (Math.abs(currentMovementX.current.max - currentMovementX.current.min) > Math.abs(currentMovementY.current.max - currentMovementY.current.min)) {
        // setScanResult(prev =>"Horizontal")
        setSequence(prev => ({ ...prev, user: [...prev.user, "Horizontal"] }))
      } else {
        // setScanResult("Vertical")
        setSequence(prev => ({ ...prev, user: [...prev.user, "Vertical"] }))
      }
      currentMovementX.current.min = 0
      currentMovementX.current.max = 0
      currentMovementY.current.min = 0
      currentMovementY.current.max = 0
      console.log('stop')
    }, 1500)
  }




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
    sequence.input.forEach((_, i) => {
      setTimeout(singleScan, i * 2500)
    })
    setTimeout(() => setValidationStart(prev => prev + 1), sequence.input.length * 2500)
  }

  return (
    <div className="App">
      <h1>SHAKE YOUR FACE!<span>CAPTCHA edition</span></h1>
      <h2>Once the model is loaded, click on the 'Start Scan' button and move your face on the asked axis</h2>
      <section className="video">
        <div className="video-feed">
          <video ref={webcamFeed} autoPlay />
        </div>
        <div className="sequence">
          {loadState.model && <button onClick={checkSequence}>Scan</button>}
          <p className={validationStart === 1 ? 'pending' : ''}>Vertical</p>
          <p className={validationStart === 2 ? 'pending' : ''}>Horizontal</p>
          <p className={validationStart === 3 ? 'pending' : ''}>Vertical</p>
        </div>
      </section>

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
