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

const detuneMult = 10;

// const synth = new Tone.PolySynth().toDestination();

myCanvas.addEventListener("mousedown", createOscShape);

function createOscShape(e){
    // check for double mousedown
    if(e.detail === 2){
        const shape = document.createElementNS(ns, "rect");
        const newId = oscShapes.length;
        shape.dataset.shapeID = newId;
        const newOsc = new Tone.Oscillator(oscOptions);
        const newChannel = new Tone.Channel(channelOptions);
        const oscShapeInit = {
            id: newId,
            shape: shape,
            osc: newOsc,
            channel: newChannel,
            // measured from top/right
            pos: [e.offsetX, e.offsetY],
            size: [1,1]
        }
        oscShapes.push(oscShapeInit);
        newOsc.chain(newChannel, Tone.Destination);
        shape.setAttribute("width", 1);
        shape.setAttribute("height", 1);
        shape.setAttribute("fill", colour2);
        setOscShapePos(oscShapeInit);
        newOsc.start();
        myCanvas.appendChild(shape);
        const initialScale = (e) => {
            scaleOscShape(e, oscShapeInit);
        }
        window.addEventListener("mousemove", initialScale);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", initialScale);
        });
    }
}

function setOscShapePos(oscShape){
    oscShape.shape.setAttribute("x", oscShape.pos[0]);
    const centreX = oscShape.pos[0] + (oscShape.size[0] / 2);
    oscShape.shape.setAttribute("y", oscShape.pos[1]);
    const centreY = oscShape.pos[1] + (oscShape.size[1] / 2);
    oscShape.channel.set({
        // distance from centre x normalised to -1 to 1
        pan: -1 + (centreX / canvasHeight * 2)
    });
    oscShape.osc.set({
        // distance from the centre y
        detune: (centreY - (canvasHeight / 2)) / detuneMult
    });
    //update pos tba for normal drag
}

// toDo getting some out of range stuff with wild dragging
// also need to handle going up and left instead of down right

function scaleOscShape(e, oscShape){
    const newWidth = Math.abs(e.offsetX - oscShape.pos[0]);
    const newHeight = Math.abs(e.offsetY - oscShape.pos[1]);
    oscShape.shape.setAttribute("width", newWidth);
    oscShape.shape.setAttribute("height", newHeight);
    oscShape.channel.set({
        volume: -16 + (16 * ((newWidth * newHeight) / canvasArea))
    });
    oscShapes[oscShape.id].size = [newWidth, newHeight];
    setOscShapePos(oscShapes[oscShape.id]);
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

