// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

console.log(data)

function goToFirstWindow() {
  // Envia o sinal para o main process fechar a janela
  ipcRenderer.send("close-child-window");
}
