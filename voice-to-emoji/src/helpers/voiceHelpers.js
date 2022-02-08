import "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";

const listenOptions = {
  includeSpectrogram: true, // in case listen should return result.spectrogram
  probabilityThreshold: 0.75,
  invokeCallbackOnNoiseAndUnknown: true,
  overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
};

const findBiggestIndex = (values) => {
  const biggestValue = Math.max(...values);
  const biggestIndex = values.indexOf(biggestValue);

  return biggestIndex;
};

const createModel = async () => {
  const URL = "http://localhost:3000/model/";
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
};

const listen = async (callback) => {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen((result) => {
    const scores = result.scores; // probability of prediction for each class
    // render the probability scores per class

    const currentBiggestIndex = findBiggestIndex(scores);
    if (currentBiggestIndex !== 0) {
      callback(currentBiggestIndex);
    }
  }, listenOptions);

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
};

export default listen;
