const { ipcRenderer } = require("electron");

function aboutWindow() {
  const content = { width: 500, height : 510, type :"about"}
  ipcRenderer.send("showDialogWindow", content);
}

function setupWindow() {
  //ipcRenderer.send("showSetupWindow");
  const content = { width: 800, height : 510, type :"setup"}
  ipcRenderer.send("showDialogWindow", content);
  
}

function addWindow() {
  const selectedItem = document.querySelector("li.pure-menu-selected-background");
  const selectedBrand = selectedItem.getAttribute("data-brand");

  const content = { width: 600, height : 610, type :"add", brand : selectedBrand}
  ipcRenderer.send("showDialogWindow", content);
  //ipcRenderer.send("showAddWindow", { brand: selectedBrand });
}

