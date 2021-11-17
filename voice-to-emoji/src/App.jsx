import { useState } from "react";
import "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

import "./App.css";

function App() {
	const labels = [
		"Background Noise",
		"Butterfly",
		"JavaScript",
		"Potato",
		"Toaster",
	];
	const coolLabels = ["🎶", "🦋", "🤖", "🥔", "🔥🍞🔥🍞🔥"];
	const [currentIndex, setCurrentIndex] = useState(null);
	const [ready, setReady] = useState(false);

	const findBiggestIndex = (listOfValues) => {
		// [1,2,3,5,0]
		const biggestNumber = Math.max(...listOfValues);
		const biggestIndex = listOfValues.indexOf(biggestNumber);
		if (biggestIndex) {
			return setCurrentIndex(biggestIndex);
		}
	};

	const createModel = async () => {
		const URL = "http://localhost:3001/model/";
		const checkpointURL = URL + "model.json"; // model topology
		const metadataURL = URL + "metadata.json"; // model metadata

		const recognizer = speechCommands.create(
			"BROWSER_FFT", // fourier transform type, not useful to change
			undefined, // speech commands vocabulary feature, not useful for your models
			checkpointURL,
			metadataURL
		);

		// check that model and metadata are loaded via HTTPS requests.

		// return recognizer.ensureModelLoaded().then(() => recognizer)
		await recognizer.ensureModelLoaded();

		return recognizer;
	};

	const init = async () => {
		const recognizer = await createModel();
		setReady(true);
		const classLabels = recognizer.wordLabels(); // get class labels

		// listen() takes two arguments:
		// 1. A callback function that is invoked anytime a word is recognized.
		// 2. A configuration object with adjustable fields
		recognizer.listen(
			(result) => {
				const scores = result.scores; // probability of prediction for each class
				// render the probability scores per class
				// console.log(scores, classLabels);
				findBiggestIndex(scores);
			},
			{
				includeSpectrogram: true, // in case listen should return result.spectrogram
				probabilityThreshold: 0.9,
				invokeCallbackOnNoiseAndUnknown: false,
				overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
			}
		);

		// Stop the recognition in 5 seconds.
		// setTimeout(() => recognizer.stopListening(), 5000);
	};

	return (
		<div className="App">
			{!ready && <button onClick={init}>Start!</button>}
			<p style={{ fontSize: "8em" }}>{coolLabels[currentIndex]}</p>
		</div>
	);
}

export default App;
