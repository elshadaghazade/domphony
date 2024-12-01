let isPlaying = false;

const playButton = document.querySelector('#play-btn');
const pauseButton = document.querySelector('#pause-btn');
const container = document.querySelector('.container') as HTMLDivElement;
const loading = document.querySelector('.loading') as HTMLDivElement;
const canvas = document.getElementById("visualizer") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d");

const port = chrome.runtime.connect({ name: "popup" });

window.onload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "isLoaded" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message failed:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully");
                }
            });
        } else {
            console.error("No active tab found");
        }
    });
}

interface MessageType {
    action: string;
    waveform: number[]; // The waveform data
    bufferLength: number;
}

port.onMessage.addListener((message: MessageType) => {
    if (message.action === 'updateProgress') {
        visualizeAudio(message.bufferLength, message.waveform);
    } else if (message.action === 'loaded') {
        container.style.display = 'block';
        loading.style.display = 'none';
    }

    
});

playButton?.addEventListener("click", (e) => {
    if (isPlaying) {
        return;
    }

    isPlaying = true;

    playButton.setAttribute('disabled', 'true');
    pauseButton?.removeAttribute('disabled');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "play" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message failed:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully");
                }
            });
        } else {
            console.error("No active tab found");
        }
    });
});

pauseButton?.addEventListener("click", (e) => {
    if (!isPlaying) {
        return;
    }

    isPlaying = false;

    playButton?.removeAttribute('disabled');
    pauseButton.setAttribute('disabled', 'true');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "pause" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message failed:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully");
                }
            });
        } else {
            console.error("No active tab found");
        }
    });
});

function visualizeAudio(bufferLength: number, waveform: number[]) {

    function draw() {
        if (!isPlaying || !canvasCtx) {
            // Stop drawing if not playing
            return;
        }

        // Clear canvas
        canvasCtx!.fillStyle = "rgba(255, 255, 255, 1)";
        canvasCtx!.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the waveform
        canvasCtx!.lineWidth = 1;
        canvasCtx!.strokeStyle = "black";
        canvasCtx!.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const y = ((waveform[i] || 0) + 1) * (canvas.height / 2); // Normalize waveform value to canvas height

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        // Continue the animation loop
        // requestAnimationFrame(draw);
    }

    draw();
}