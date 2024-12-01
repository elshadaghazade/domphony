let popupPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {

    if (port.name === 'popup') {
        popupPort = port;
    }

    // Listen for disconnection (when popup closes)
    port.onDisconnect.addListener(() => {
        console.log("Popup disconnected. Stopping music.");
        // Notify content script to stop music
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "pause" });
            }
        });

        popupPort = null;
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const messages = ["updateProgress", "loaded"];
    if (messages.indexOf(message.action) >= 0 && popupPort) {
        popupPort.postMessage(message);
    }
});