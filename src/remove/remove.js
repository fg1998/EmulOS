// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findSystem, getConfigFile, saveConfigFile } from "../util.js";
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

document.getElementById("brand").value = data.content.brand;
document.getElementById("name").value = data.content.name;

// CANCEL BUTTON EVENT
document.addEventListener("DOMContentLoaded", () => {
  const cancelButton = document.getElementById("btnCancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", cancel);
  }
});

export function goToFirstWindow(param) {
  ipcRenderer.send("close-dialog-window", param);
}

// REMOVE  BUTTON EVENT
document.addEventListener("DOMContentLoaded", () => {
  const removeButton = document.getElementById("btnRemove");
  if (removeButton) {
    removeButton.addEventListener("click", remove);
  }
});

function cancel() {
  goToFirstWindow(null);
}

// REMOVE BUTTON METHOD
function remove() {
  var _brand = document.getElementById("brand").value;
  var _name = document.getElementById("name").value;

  var jsonResult = getConfigFile();

  const indice = jsonResult.systems.findIndex((system) => system.name === _name && system.brand === _brand);

  jsonResult.systems.splice(indice, 1);

  saveConfigFile(jsonResult);
  goToFirstWindow({ brand: _brand, name: _name });
}
