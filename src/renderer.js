const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");
const { electron } = require("process");
const { empire } = require("fontawesome");

//Parsing XML emulators File
var emulatorsFile = path.join(__dirname, ".", "emulators.xml");
var emulatorsXML = fs.readFileSync(emulatorsFile);
const parser = new XMLParser.XMLParser();
const jsonResult = parser.parse(emulatorsXML);

jsonResult.emulators.brand.forEach((element, index) => {
  var menu = document.getElementById("brandMenu");
  menu.innerHTML =
    menu.innerHTML +
    `<li class="pure-menu-item" data-brand="${element.name}"> \
                        <a href="#" data-brand="${element.name}" onclick='selectBrand(event)' class="pure-menu-link"> \
                          <i class="fa fa-circle-o"  data-brand="${element.name}"></i> \
                          ${element.name} \
                        </a> \
                      </li>`;
});

// Lateral Menu (brand) Click
function selectBrand(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  console.log(brand);

  //Remove pure-menu-selected-background from previous selected brand
  var previous = document.querySelector(".pure-menu-selected-background");
  if (previous) previous.classList.remove("pure-menu-selected-background");

  var previousIcon = document.querySelector(".fa-circle");
  if (previousIcon) {
    previousIcon.classList.remove("fa-circle");
    previousIcon.classList.add("fa-circle-o");
  }

  //Add selected-class to selected button
  const menuItem = document.querySelector(`li[data-brand='${brand}']`);
  menuItem.classList.add("pure-menu-selected-background");

  //Change selected icon
  const menuIcon = document.querySelector(`i[data-brand='${brand}']`);
  menuIcon.classList.remove("fa-circle-o");
  menuIcon.classList.add("fa-circle");
  
  doTiles(brand)
}


const firstBrand = jsonResult.emulators.brand[0].name;
const menuItem = document.querySelector(`li[data-brand='${firstBrand}']`);
menuItem.classList.add("pure-menu-selected-background");
const menuIcon = document.querySelector(`i[data-brand='${firstBrand}']`);
menuIcon.classList.remove("fa-circle-o");
menuIcon.classList.add("fa-circle");
doTiles(firstBrand)

function doTiles(brandName) {
  const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == brandName);
  const content = document.getElementById("content");
  content.innerHTML = "";

  machineBrand.emulator.forEach((element, index) => {
    const image = element.image ? `./screen/${element.image}` : `./screen/${element.type}_not_found.png`;

    const card = `<div class="pure-u-sm-1-2 pure-u-md-1-3 card" style='position:relative'>
                    <img src="${image}" class="pure-img img-border">
                    <h4>${element.name}</h4>
                    <p>${element.desc}</p>
                    <div class="icons" style=''>
                      <i onclick='favorite(event)' class="btn-favorite fa fa-star${element.favorite ? " selected" : "-o"}" data-favorite='${element.favorite}'  data-brand='${machineBrand.name}' data-name='${element.name}'></i>
                      <i onclick='play(event)' class="btn-play fa fa-play"  data-brand='${machineBrand.name}' data-name='${element.name}'></i>
                      <i onclick='config()' class="btn-config fa fa-gear"  data-brand='${machineBrand.name}' data-name='${element.name}'></i>
                      <i onclick='remove()' class="btn-remove fa fa-trash"  data-brand='${machineBrand.name}' data-name='${element.name}'></i>
                    </div>
                  </div>`;

    content.innerHTML = content.innerHTML + card;
  });
}

function play(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const emulator = findEmulator(brand, name);
  ipcRenderer.send("playClick", emulator);
}

function favorite(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const favorite = element.dataset.favorite;
  console.log(brand, name, favorite);
}

function findEmulator(brandName, emulatorName) {
  const brand = jsonResult.emulators.brand.find((b) => b.name === brandName);
  if (brand) {
    return brand.emulator.find((e) => e.name === emulatorName);
  }
  return null;
}


