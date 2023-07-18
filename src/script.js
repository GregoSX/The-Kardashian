// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// link do modelo
const URL = "https://teachablemachine.withgoogle.com/models/V3RmVsZRj/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";


    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();


    const flip = true;
    webcam = new tmImage.Webcam(600, 600, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);


    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}


async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let maxProbability = 0;
    let maxProbabilityIndex = 0;

    for (let i = 0; i < maxPredictions; i++) {
        const probability = prediction[i].probability.toFixed(2);
        if (probability > maxProbability) {
            maxProbability = probability;
            maxProbabilityIndex = i;
        }
    }

    const classPrediction = prediction[maxProbabilityIndex].className;
    labelContainer.innerHTML = classPrediction;

}

window.addEventListener('DOMContentLoaded', (event) => {
    init();
});