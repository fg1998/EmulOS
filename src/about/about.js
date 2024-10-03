
const { ipcRenderer } = require("electron");

function closeAboutWindow() {
    ipcRenderer.send("close-dialog-window");
}