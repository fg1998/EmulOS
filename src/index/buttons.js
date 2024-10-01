const { ipcRenderer } = require("electron");

function aboutWindow() {
    ipcRenderer.send('showAboutWindow')
}

function setupWindow() {
    ipcRenderer.send('showSetupWindow')
}