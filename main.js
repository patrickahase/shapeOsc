// based on https://codepen.io/tsuhre/details/xgmEPe
const ns = "http://www.w3.org/2000/svg";
const myCanvas = document.getElementById("svgCanvas");
const canvasWidth = myCanvas.getAttribute("width");
const canvasHeight = myCanvas.getAttribute("height");
const canvasArea = canvasWidth * canvasHeight;
const stepButton = document.getElementById("stepButton");

const colour1 = "black";
const colour2 = "#ffffff44";

// const synth = new Tone.PolySynth().toDestination();

myCanvas.addEventListener("mousedown", createBox);

function createBox(e){
    // check for double mousedown
    if(e.detail === 2){
        const box = document.createElementNS(ns, "rect");
        box.setAttribute("x", e.offsetX);
        box.setAttribute("y", e.offsetY);
        box.setAttribute("width", 10);
        box.setAttribute("height", 10);
        box.setAttribute("fill", colour2);
        myCanvas.appendChild(box);
        const newChannel = new Tone.Channel(-32).toDestination();
        const newOsc = new Tone.Oscillator(440, "sawtooth").connect(newChannel);
        newOsc.start();
        const dragThisBox = (ev) => {
            dragBox(ev, box, newOsc, newChannel, [e.offsetX, e.offsetY]);
        }
        window.addEventListener("mousemove", dragThisBox);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", dragThisBox);
        });
    }
}

const dragBox = (e, box, osc, channel, startCoords) => {
    let left = Math.min(e.offsetX, startCoords[0]);
    let top = Math.min(e.offsetY, startCoords[1]);
    let width = Math.abs(e.offsetX - startCoords[0]);
    let height = Math.abs(e.offsetY - startCoords[1]);
    osc.set({
        detune: top + height / 200
    })
    channel.set({
        pan: -1 + ((left + width / 2) / canvasHeight) * 2,
        volume: -16 + (16 * ((width * height) / canvasArea))
    });
    box.setAttribute("x", left);
    box.setAttribute("y", top);
    box.setAttribute("width", width);
    box.setAttribute("height", height);
}

