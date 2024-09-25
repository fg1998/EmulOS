const { ipcRenderer } = require("electron");
const { electron } = require("process");
import { getConfigFile } from "../util.js";
import { addItensToLateralMenu } from "./lateralmenu.js";
import { doTiles } from "./maincontent.js";

//Get Config from emulator.json
let jsonResult = getConfigFile();

// FROM lateralmenu.js
addItensToLateralMenu(jsonResult.brands);

//View itens from the first brand when dashboard is loaded
const firstBrand = jsonResult.brands[0].name;
const menuItem = document.querySelector(`li[data-brand='${firstBrand}']`);
menuItem.classList.add("pure-menu-selected-background");
const menuIcon = document.querySelector(`i[data-brand='${firstBrand}']`);

const emulators = jsonResult.emulators.filter((emulator) => emulator.brand == firstBrand);

//FROM maincontent.js
doTiles(firstBrand, emulators);

ipcRenderer.on("reload-tiles", function (evt, param) {
  var jsonResult = getConfigFile();

  let selectBrand = param.brand;

  doTiles(param.brand, jsonResult.emulators.brand.find((brand) => brand.name == selectBrand).emulator);
});
