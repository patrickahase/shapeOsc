// based on https://codepen.io/tsuhre/details/xgmEPe
const ns = "http://www.w3.org/2000/svg";
const myCanvas = document.getElementById("svgCanvas");
const canvasWidth = myCanvas.getAttribute("width");
const canvasHeight = myCanvas.getAttribute("height");
const stepButton = document.getElementById("stepButton");

const colour1 = "black";
const colour2 = "white";

const synth = new Tone.PolySynth().toDestination();

myCanvas.addEventListener("mousedown", createBox);

function createBox(e){
    const box = document.createElementNS(ns, "rect");
    box.setAttribute("x", e.offsetX);
    box.setAttribute("y", e.offsetY);
    box.setAttribute("width", 10);
    box.setAttribute("height", 10);
    box.setAttribute("fill", colour2);
    myCanvas.appendChild(box);
    const dragThisBox = (ev) => {
        dragBox(ev, box, [e.offsetX, e.offsetY]);
    }
    window.addEventListener("mousemove", dragThisBox);
    window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", dragThisBox);
    });
}

const dragBox = (e, box, startCoords) => {
    box.setAttribute("x", Math.min(e.offsetX, startCoords[0]));
    box.setAttribute("y", Math.min(e.offsetY, startCoords[1]));
    box.setAttribute("width", Math.abs(e.offsetX - startCoords[0]));
    box.setAttribute("height", Math.abs(e.offsetY - startCoords[1]));
}

