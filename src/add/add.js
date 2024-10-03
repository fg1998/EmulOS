// Requer o ipcRenderer do Electron
const { ipcRenderer } = require("electron");
import { findEmulator, getConfigFile, saveConfigFile } from "../util.js";
const querystring = require("querystring");

let query = querystring.parse(global.location.search);
let data = JSON.parse(query["?data"]);


let jsonResult = getConfigFile();
let typeList = jsonResult.types;
let brandList = jsonResult.brands;


const brandComp = document.getElementById("brand");
brandList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.name;
  novoItem.textContent = element.desc;
  novoItem.selected = element.name == data.brand;
  brandComp.appendChild(novoItem);
});

const typeComp = document.getElementById("type");
typeList.forEach((element) => {
  const novoItem = document.createElement("option");
  novoItem.value = element.type;
  novoItem.textContent = element.name;
  //novoItem.selected = element.type == data.type;
  typeComp.appendChild(novoItem);
});


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
  var _brand = document.getElementById("brand").value;
  var _name = document.getElementById("name").value;
  var _desc = document.getElementById("desc").value;
  var _type = document.getElementById("type").value;
  var _parameter = document.getElementById("parameter").value;
  var _image = document.getElementById("image").value;

  var jsonResult = getConfigFile();

  const newEmulator = {
    brand : _brand,
    name : _name,
    desc : _desc,
    type : _type,
    parameter : _parameter,
    favorite : "false",
    image : _image
  }

  jsonResult.emulators.push(newEmulator);

  saveConfigFile(jsonResult);
  goToFirstWindow({brand :_brand, name : _name});
}


export function goToFirstWindow(param) {
  ipcRenderer.send("close-dialog-window", param);
}
