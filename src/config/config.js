// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findEmulator, getConfig, saveConfigFile } from "../util.js";
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);

document.getElementById("brand").value = data.brand;
document.getElementById("name").value = data.name;
document.getElementById("originalName").value = data.name;
document.getElementById("desc").value = data.desc;
document.getElementById("command").value = data.command;
document.getElementById("parameter").value = data.parameter;

document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("btnSave");
  if (saveButton) {
    saveButton.addEventListener("click", save);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cancelButton = document.getElementById("btnCancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", goToFirstWindow);
  }
});

function save() {
  var selectBrand = document.getElementById("brand").value;
  var name = document.getElementById("name").value;
  var originalName = document.getElementById("originalName").value;
  var desc = document.getElementById("desc").value;
  var command = document.getElementById("command").value;
  var parameter = document.getElementById("parameter").value;

  var jsonResult = getConfig();
  const emulator = findEmulator(jsonResult, selectBrand, originalName);

  emulator.name = name;
  emulator.desc = desc;
  emulator.command = command;
  emulator.parameter = parameter;

  saveConfigFile(jsonResult);
  goToFirstWindow(selectBrand, name);
}

export function goToFirstWindow(brand, name) {
  ipcRenderer.send("close-child-window", { brand: brand, name: name });
}
