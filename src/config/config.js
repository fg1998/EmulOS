// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findEmulator, getConfig, saveConfigFile } from "../util.js";
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

let jsonResult = getConfig();
let systemList = jsonResult.systems;
const typeComp = document.getElementById("type");

systemList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.type;
  novoItem.textContent = element.type;
  novoItem.selected = element.type == data.type;
  typeComp.appendChild(novoItem);
});

document.getElementById("brand").value = data.brand;
document.getElementById("name").value = data.name;
document.getElementById("originalName").value = data.name;
document.getElementById("desc").value = data.desc;
//document.getElementById("type").value = data.type;
document.getElementById("parameter").value = data.parameter;

// SAVE BUTTON EVENT
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("btnSave");
  if (saveButton) {
    saveButton.addEventListener("click", save);
  }
});

// CANCEL BUTTON EVENT
document.addEventListener("DOMContentLoaded", () => {
  const cancelButton = document.getElementById("btnCancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", goToFirstWindow);
  }
});

// SAVE BUTTON METHOD
function save() {
  var selectBrand = document.getElementById("brand").value;
  var name = document.getElementById("name").value;
  var originalName = document.getElementById("originalName").value;
  var desc = document.getElementById("desc").value;
  var type = document.getElementById("type").value;
  var parameter = document.getElementById("parameter").value;

  var jsonResult = getConfig();
  const emulator = findEmulator(jsonResult, selectBrand, originalName);

  emulator.name = name;
  emulator.desc = desc;
  emulator.type = type;
  emulator.parameter = parameter;

  saveConfigFile(jsonResult);
  goToFirstWindow(selectBrand, name);
}

//CANCEL BUTTON METHOD
export function goToFirstWindow(brand, name) {
  ipcRenderer.send("close-child-window", { brand: brand, name: name });
}
