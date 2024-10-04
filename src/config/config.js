// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findEmulator, getConfigFile, saveConfigFile } from "../util.js";
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

console.log(data)

let jsonResult = getConfigFile();
let emulatorList = jsonResult.emulators;
let brandList = jsonResult.brands;

const brandComp = document.getElementById("brand");
brandList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.name;
  novoItem.textContent = element.desc;
  novoItem.selected = element.name == data.content.brand;
  brandComp.appendChild(novoItem);
});

const emulatorComp = document.getElementById("emulator");
emulatorList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.key;
  novoItem.textContent = element.name;
  novoItem.selected = element.key == data.content.emulator;
  emulatorComp.appendChild(novoItem);
});

document.getElementById("originalBrand").value = data.content.brand;
document.getElementById("name").value = data.content.name;
document.getElementById("originalName").value = data.content.name;
document.getElementById("desc").value = data.content.desc;
document.getElementById("parameter").value = data.content.parameter;

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
    cancelButton.addEventListener("click", cancel);
  }
});

function cancel() {
  goToFirstWindow(null)
}

// SAVE BUTTON METHOD
function save() {
  var originalBrand = document.getElementById("originalBrand").value;
  var selectBrand = document.getElementById("brand").value;
  var name = document.getElementById("name").value;
  var originalName = document.getElementById("originalName").value;
  var desc = document.getElementById("desc").value;
  var emulator = document.getElementById("emulator").value;
  var parameter = document.getElementById("parameter").value;

  var jsonResult = getConfigFile();

  const system = findEmulator(jsonResult.systems, originalBrand, originalName);

  system.name = name;
  system.desc = desc;
  system.emulator = emulator;
  system.parameter = parameter;
  system.brand = selectBrand;

  saveConfigFile(jsonResult);
  goToFirstWindow({brand :selectBrand, name : name});
}

//CANCEL BUTTON METHOD
export function goToFirstWindow(param) {
  ipcRenderer.send("close-dialog-window", param);
}
