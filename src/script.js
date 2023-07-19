// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// link do modelo
//https://teachablemachine.withgoogle.com/models/V3RmVsZRj/ 
const URL = "https://teachablemachine.withgoogle.com/models/V3RmVsZRj/";

let model, webcam, labelContainer, maxPredictions, predictionList;
const map_objects = {
    CADERNO: "Caderno", 
    CANETA: "Caneta", 
    BARALHO: "Baralho", 
    BORRACHA: "Borracha", 
    CELULAR: "Celular", 
    VAZIO: "Vazio", 
    OCULOS: "Óculos", 
    GARRAFA: "Garrafa", 
    CAMISA: "Camisa", 
    ESTOJO: "Estojo", 
    MOUSE: "Mouse"
}

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
    predictionList = document.getElementById("prediction-list");
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

    
    
    predictionList.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        setProbabilityList(prediction[i])
        const probability = prediction[i].probability.toFixed(2);
        if (probability > maxProbability) {
            maxProbability = probability;
            maxProbabilityIndex = i;
        }
    }
    
    const classPrediction = prediction[maxProbabilityIndex].className;
    labelContainer.innerHTML = map_objects[classPrediction];
    
}

function setProbabilityList(predictionObject){
    let restoBarraPorcentagem = 1 - predictionObject.probability.toFixed(2);

    predictionList.innerHTML += 
    `<li style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center">${predictionObject.className}:
    <div style="display: flex; height: 2rem; width: 10rem; margin-left: 1rem"> 
        <div style="background-color: #3923b6; width: ${predictionObject.probability.toFixed(2)*10}rem; height: 100%"></div>
        <div style="background-color: #c1c1c1; width: ${restoBarraPorcentagem*10}rem; height: 100%"></div>
    </div>
    </li>`
}

window.addEventListener('DOMContentLoaded', (event) => {
    init();
});