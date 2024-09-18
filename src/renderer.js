const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");
const { electron } = require("process");

var emulatorsFile = path.join(__dirname, ".", "emulators.json");
var jsonFile = fs.readFileSync(emulatorsFile)
var jsonResult = JSON.parse(jsonFile)

console.log(jsonResult)

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

  doTiles(brand);
}

const firstBrand = jsonResult.emulators.brand[0].name;
const menuItem = document.querySelector(`li[data-brand='${firstBrand}']`);
menuItem.classList.add("pure-menu-selected-background");
const menuIcon = document.querySelector(`i[data-brand='${firstBrand}']`);
menuIcon.classList.remove("fa-circle-o");
menuIcon.classList.add("fa-circle");
doTiles(firstBrand);

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
                      <i onclick='favorite(event)' class="btn-favorite fa fa-star${element.favorite=='true' ? " selected" : "-o"}" data-favorite='${element.favorite}'  data-brand='${machineBrand.name}' data-name='${element.name}'></i>
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
  const emulator = findEmulator(brand, name);
  console.log(favorite=='true')
  emulator.favorite = (favorite == 'true' ? 'false' : 'true')



  const originalName = path.join(__dirname, ".", "emulators.json");
  const oldName = path.join(__dirname, ".", "emulators_old.json");
  fs.renameSync(originalName,oldName )
  fs.writeFileSync(originalName, JSON.stringify(jsonResult,null, 2));
  
}

function findEmulator(brandName, emulatorName) {
  const brand = jsonResult.emulators.brand.find((b) => b.name === brandName);
  if (brand) {
    var ret = brand.emulator.find((e) => e.name === emulatorName);
    return ret;
  }
  return null;
}
