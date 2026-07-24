// based on https://codepen.io/tsuhre/details/xgmEPe
const ns = "http://www.w3.org/2000/svg";
const myCanvas = document.getElementById("svgCanvas");
const canvasWidth = myCanvas.getAttribute("width");
const canvasHeight = myCanvas.getAttribute("height");
const canvasArea = canvasWidth * canvasHeight;


const colour1 = "black";
const colour2 = "#ffffff44";

let selectedBox = null;

let oscShapes = [
    // template would be
    // {
    //     id: 0,
    //     shape: SVGRect,
    //     osc: Oscillator,
    //     channel: Channel
    // }
];

const oscOptions = {
    frequency: 440,
    type: "sawtooth"
};
const channelOptions = {
    volume: -32
};

const detuneMult = 2;

// const synth = new Tone.PolySynth().toDestination();

myCanvas.addEventListener("mousedown", createOscShape);

function createOscShape(e){
    // check for double mousedown
    if(e.detail === 2){
        const shape = document.createElementNS(ns, "polygon");
        const newId = oscShapes.length;
        shape.dataset.shapeID = newId;
        let pointsList = [
            [e.offsetX, e.offsetY],
            [e.offsetX + 1, e.offsetY],
            [e.offsetX + 1, e.offsetY + 1],
            [e.offsetX, e.offsetY + 1]
        ];
        shape.setAttribute("points", pointListToPoints(pointsList));
        const newOsc = new Tone.Oscillator(oscOptions);
        const newChannel = new Tone.Channel(channelOptions);
        const oscShapeInit = {
            id: newId,
            shape: shape,
            osc: newOsc,
            channel: newChannel,
            // measured from top/right
            pos: [e.offsetX, e.offsetY],
            pointsList: pointsList
        }
        oscShapes.push(oscShapeInit);
        newOsc.chain(newChannel, Tone.Destination);
        shape.setAttribute("fill", colour2);
        setOscShapeCentre(oscShapeInit);
        newOsc.start();
        myCanvas.appendChild(shape);
        const initialScale = (e) => {
            scaleOscShape(e, oscShapeInit);
        }
        myCanvas.addEventListener("mousemove", initialScale);
        myCanvas.addEventListener("mouseup", () => {
            myCanvas.removeEventListener("mousemove", initialScale);
        });
    }
}

function setOscShapeCentre(oscShape){
    const centreX = oscShape.pointsList[0][0] + ((oscShape.pointsList[2][0] - oscShape.pointsList[0][0]) / 2);
    const centreY = oscShape.pointsList[0][1] + ((oscShape.pointsList[2][1] - oscShape.pointsList[0][1]) / 2);
    oscShape.channel.set({
        //distance from centre x normalised to -1 to 1
       pan: -1 + ((centreX / canvasHeight) * 2)
    });
    oscShape.osc.set({
        //distance from the centre y
       detune: (centreY - (canvasHeight / 2)) / detuneMult
    });
    //update pos tba for normal drag
}

function scaleOscShape(e, oscShape){
    const newWidth = e.offsetX - oscShape.pos[0];
    console.log(e.offsetX)
    const newHeight = e.offsetY - oscShape.pos[1];
    let newPointsList = [
        [oscShape.pos[0], oscShape.pos[1]],
        [oscShape.pos[0] + newWidth, oscShape.pos[1]],
        [oscShape.pos[0] + newWidth, oscShape.pos[1] + newHeight],
        [oscShape.pos[0], oscShape.pos[1] + newHeight]
    ];
    oscShape.shape.setAttribute("points", pointListToPoints(newPointsList));
    oscShapes[oscShape.id].pointsList = newPointsList;
    oscShape.channel.set({
        volume: -16 + (16 * ((newWidth * newHeight) / canvasArea))
    });
    setOscShapeCentre(oscShapes[oscShape.id]);
}

function selectBox(e){
    Array.from(document.getElementsByClassName("selectedBox")).forEach((elm) => {
        elm.classList.remove("selectedBox");
    })
    selectedBox = e.target;
    selectedBox.classList.add("selectedBox");
}

function startDrag(e) {

}

function pointListToPoints(pointList){
    let pointsString = ``;
    pointList.forEach((point) => {
       pointsString += `${point[0]},${point[1]} `;
    });
    return pointsString;
}
