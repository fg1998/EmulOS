// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findEmulator, getConfigFile, saveConfigFile } from "../util.js";

let jsonResult = getConfigFile();
let typeList = jsonResult.types;
let brandList = jsonResult.brands;
let config = jsonResult.config;

// Read and Set values from configFile

document.getElementById("rompath").value = config.rompath;

const brandComp = document.getElementById("brandName");
brandList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.name;
  novoItem.textContent = element.name;
  brandComp.appendChild(novoItem);
});

brandComp.addEventListener("change", (event) => {
  const selectedOption = event.target.value; // Valor do option selecionado
  console.log("Marca selecionada:", selectedOption);
  showBrandDesc(selectedOption);
});

showBrandDesc(brandComp.options[0].value);

export function showBrandDesc(brandName) {
  //var firstBrand = brandComp.options[0].value;
  var selectedBrand = brandList.find((x) => x.name == brandName);
  document.getElementById("brandDesc").value = selectedBrand.desc;
}

// SAVE BUTTON EVENT
document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("btnSaveGeneral");
  if (saveButton) {
    saveButton.addEventListener("click", saveGeneral);
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
  goToFirstWindow(null);
}

function saveGeneral() {
  let jsonResult = getConfigFile();

  var _romPath = document.getElementById("rompath").value;
  jsonResult.config.rompath = _romPath;
  console.log(jsonResult.config);

  saveConfigFile(jsonResult);
}

/*
const brandComp = document.getElementById("brand");
brandList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.name;
  novoItem.textContent = element.desc;
  novoItem.selected = element.name == data.content.brand;
  brandComp.appendChild(novoItem);
});

const typeComp = document.getElementById("type");
typeList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.type;
  novoItem.textContent = element.name;
  novoItem.selected = element.type == data.content.type;
  typeComp.appendChild(novoItem);
});

//document.getElementById("brand").value = data.brand;
document.getElementById("originalBrand").value = data.content.brand;
document.getElementById("name").value = data.content.name;
document.getElementById("originalName").value = data.content.name;
document.getElementById("desc").value = data.content.desc;
//document.getElementById("type").value = data.type;
document.getElementById("parameter").value = data.content.parameter;
*/



// SAVE BUTTON METHOD
function save() {
  var originalBrand = document.getElementById("originalBrand").value;
  var selectBrand = document.getElementById("brand").value;
  var name = document.getElementById("name").value;
  var originalName = document.getElementById("originalName").value;
  var desc = document.getElementById("desc").value;
  var type = document.getElementById("type").value;
  var parameter = document.getElementById("parameter").value;

  var jsonResult = getConfigFile();

  const emulator = findEmulator(jsonResult.emulators, originalBrand, originalName);

  emulator.name = name;
  emulator.desc = desc;
  emulator.type = type;
  emulator.parameter = parameter;
  emulator.brand = selectBrand;

  saveConfigFile(jsonResult);
  goToFirstWindow({ brand: selectBrand, name: name });
}

//CANCEL BUTTON METHOD
export function goToFirstWindow(param) {
  ipcRenderer.send("close-dialog-window", param);
}
