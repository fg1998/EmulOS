const { ipcRenderer } = require("electron");

function aboutWindow() {
  ipcRenderer.send("showAboutWindow");
}

function setupWindow() {
  ipcRenderer.send("showSetupWindow");
}

function addWindow() {
  const selectedItem = document.querySelector("li.pure-menu-selected-background");
  const selectedBrand = selectedItem.getAttribute("data-brand");
  ipcRenderer.send("showAddWindow", { brand: selectedBrand });
}

