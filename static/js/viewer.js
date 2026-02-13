let signals = {1: [], 2: []};
let animation = {1: null, 2: null};
let zoomLevel = {1: 1, 2: 1};
let currentIndex = {1: 0, 2: 0};

function draw(channel) {
    const canvas = document.getElementById("canvas" + channel);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let signal = signals[channel];
    if (!signal.length) return;

    ctx.strokeStyle = "lime";
    ctx.beginPath();

    let step = zoomLevel[channel];

    for (let i = 0; i < canvas.width; i++) {
        let idx = currentIndex[channel] + i * step;
        if (idx >= signal.length) break;

        let y = canvas.height / 2 - signal[Math.floor(idx)][0] * 50;
        ctx.lineTo(i, y);
    }

    ctx.stroke();
}

function play(channel) {
    let speed = document.getElementById("speed" + channel).value;

    animation[channel] = setInterval(() => {
        currentIndex[channel] += 2;
        draw(channel);
    }, 50 / speed);
}

function pause(channel) {
    clearInterval(animation[channel]);
}

function zoomIn(channel) {
    zoomLevel[channel] *= 0.8;
    draw(channel);
}

function zoomOut(channel) {
    zoomLevel[channel] *= 1.2;
    draw(channel);
}

document.getElementById("upload1").addEventListener("change", function() {
    uploadFile(this.files[0], 1);
});

document.getElementById("upload2").addEventListener("change", function() {
    uploadFile(this.files[0], 2);
});

function uploadFile(file, channel) {
    let formData = new FormData();
    formData.append("file", file);

    fetch("/upload/" + channel, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            signals[channel] = data.signal;
            draw(channel);
        }
    });
}
