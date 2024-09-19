// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

document.getElementById('brand').value = data.brand
document.getElementById('name').value = data.name
document.getElementById('desc').value = data.desc
document.getElementById('command').value = data.command
document.getElementById('parameter').value = data.parameter

function save() {

var brand = document.getElementById('brand').value
var name = document.getElementById('name').value
var desc = document.getElementById('desc').value
var command = document.getElementById('command').value
var parameter = document.getElementById('parameter').value

console.log(name)


  console.log('save')
}

function goToFirstWindow() {
  // Envia o sinal para o main process fechar a janela
  ipcRenderer.send("close-child-window");
}
