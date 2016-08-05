const canvasEl = document.getElementsByTagName('canvas')[0];
const ctx = canvasEl.getContext('2d');

const audio = new Audio();
audio.src = 'https://crossorigin.me/http://streaming.azpm.org/kuaz48.mp3'; //'https://crossorigin.me/http://142.4.217.133:8222/stream';
audio.crossOrigin = 'anonymous';

//

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = .7;
var source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
source.connect(audioCtx.destination);

//

let freqData = new Uint8Array(analyser.frequencyBinCount);

audio.oncanplay = () => {
    audio.play();
    render();
};

function render() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    drawSpectrum();
    
    analyser.getByteFrequencyData(freqData);
    
    requestAnimationFrame(render);
}

let lineWidth;
function drawSpectrum() {
    let height;
    for (let i = 0; i < analyser.frequencyBinCount - 32; i++) {
        height = freqData[i] / 255 * canvasEl.height;
        ctx.fillRect(i * lineWidth * 1.6, canvasEl.height - height, lineWidth, height);
    }
}

function onWindowResize(event) {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    analyser.fftSize = 128;
    lineWidth = canvasEl.width / analyser.frequencyBinCount * 1.2;
    ctx.fillStyle = '#eee';
}
util.addEvent(window, 'resize', onWindowResize);
onWindowResize();
