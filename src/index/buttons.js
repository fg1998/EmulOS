const { ipcRenderer } = require("electron");

function aboutWindow() {
    console.log(1)
    ipcRenderer.send('showAboutWindow')
   
}