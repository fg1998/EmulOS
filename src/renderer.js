const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");
const { electron } = require("process");

var emulatorsFile = path.join(__dirname, ".", "emulators.json");
var jsonFile = fs.readFileSync(emulatorsFile);
var jsonResult = JSON.parse(jsonFile);

addItensToLateralMenu();

// Lateral Menu (brand) Click events
function selectBrand(event) {
  const element = event.target;
  const selectBrand = element.dataset.brand;

  //Remove pure-menu-selected-background from previous selected brand
  var previous = document.querySelector(".pure-menu-selected-background");
  if (previous) previous.classList.remove("pure-menu-selected-background");

  var previousIcon = document.querySelector(".fa-circle");
  if (previousIcon) {
    previousIcon.classList.remove("fa-circle");
    previousIcon.classList.add("fa-circle-o");
  }
  var previousIconFavorite = document.querySelector(".fa-star.favicon");
  if (previousIconFavorite) {
    previousIconFavorite.classList.remove("fa-star");
    previousIconFavorite.classList.add("fa-star-o");
  }

  //Add selected-class to selected button
  const menuItem = document.querySelector(`li[data-brand='${selectBrand}']`);
  menuItem.classList.add("pure-menu-selected-background");

  //Change selected icon
  const menuIcon = document.querySelector(`i[data-brand='${selectBrand}']`);
  menuIcon.classList.remove(selectBrand == "favorites" ? "fa-star-o" : "fa-circle-o");
  menuIcon.classList.add(selectBrand == "favorites" ? "fa-star" : "fa-circle");

  if (selectBrand == "favorites") {
    doTiles("favorites", getFavoriteEmulators());
  } else {
    doTiles(selectBrand, jsonResult.emulators.brand.find((brand) => brand.name == selectBrand).emulator);
  }
}

//View itens from the first brand when dashboard is loaded
const firstBrand = jsonResult.emulators.brand[0].name;
const menuItem = document.querySelector(`li[data-brand='${firstBrand}']`);
menuItem.classList.add("pure-menu-selected-background");
const menuIcon = document.querySelector(`i[data-brand='${firstBrand}']`);
menuIcon.classList.remove("fa-circle-o");
menuIcon.classList.add("fa-circle");
const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == firstBrand).emulator;
doTiles(firstBrand, machineBrand);

// DRAW EMULATOR TILES (MAIN CONTENT)
function doTiles(brandName, machineBrand) {
  //const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == brandName);
  const content = document.getElementById("content");
  content.innerHTML = "";

  machineBrand.forEach((element, index) => {
    const image = element.image ? `./screen/${element.image}` : `./screen/${element.type}_not_found.png`;
    const card = `<div class="pure-u-sm-1-2 pure-u-md-1-3 card" style='position:relative'>
                    <img src="${image}" class="pure-img img-border">
                    <h4>${element.name}</h4>
                    <p>${element.desc}</p>
                    <div class="icons" style=''>
                      <i onclick='play(event)' class="btn-play fa fa-play"  data-brand='${brandName}' data-name='${element.name}'></i>   
                      <i onclick='favorite(event)' class="btn-favorite fa fa-star${element.favorite == "true" ? " selected" : "-o"}" data-favorite='${element.favorite}'  data-brand='${brandName}' data-name='${element.name}'></i>      
                      <i onclick='config(event)' class="btn-config fa fa-gear"  data-brand='${brandName}' data-name='${element.name}'></i>
                      <i onclick='remove()' class="btn-remove fa fa-trash"  data-brand='${brandName}' data-name='${element.name}'></i>
                    </div>
                  </div>`;

    content.innerHTML = content.innerHTML + card;
  });
}

function config(event) {
  console.log("config");
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const emulator = findEmulator(brand, name);
  ipcRenderer.send("configClick", emulator);
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
  const selectBrand = element.dataset.brand;
  const name = element.dataset.name;
  const favorite = element.dataset.favorite;
  const emulator = findEmulator(selectBrand, name);

  emulator.favorite = favorite == "true" ? "false" : "true";

  const originalName = path.join(__dirname, ".", "emulators.json");
  const oldName = path.join(__dirname, ".", "emulators_old.json");
  fs.renameSync(originalName, oldName);
  fs.writeFileSync(originalName, JSON.stringify(jsonResult, null, 2));

  const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == selectBrand).emulator;

  doTiles(selectBrand, machineBrand);
}



function getFavoriteEmulators() {
  const favoriteEmulators = [];
  data = jsonResult;
  data.emulators.brand.forEach((brand) => {
    brand.emulator.forEach((emulator) => {
      if (emulator.favorite === "true" || emulator.favorite === true) {
        favoriteEmulators.push({
          brand: brand.name,
          name: emulator.name,
          desc: emulator.desc,
          favorite: emulator.favorite,
          image: emulator.image,
          command: emulator.command,
          parameter: emulator.parameter,
          type: emulator.type,
        });
      }
    });
  });
  return favoriteEmulators;
}

function addItensToLateralMenu() {
  //ADD ITENS DO LATERAL MENU (BRANDS)
  var menu = document.getElementById("brandMenu");

  jsonResult.emulators.brand.forEach((element, index) => {
    menu.innerHTML =
      menu.innerHTML +
      `<li class="pure-menu-item" data-brand="${element.name}"> \
                        <a href="#" data-brand="${element.name}" onclick='selectBrand(event)' class="pure-menu-link"> \
                          <i class="fa fa-circle-o"  data-brand="${element.name}"></i> \
                          ${element.name} \
                        </a> \
                      </li>`;
  });

  //ADD SEPARATOR
  menu.innerHTML =
    menu.innerHTML +
    `<li class="pure-menu-item"> \
                    <span class='separator'>&nbsp;</span>
                  </li>`;

  //ADD FAVORITES
  menu.innerHTML =
    menu.innerHTML +
    `<li class="pure-menu-item" data-brand="favorites"> \
                        <a href="#" data-brand="favorites" onclick='selectBrand(event)' class="pure-menu-link"> \
                          <i class="fa fa-star-o favicon"  data-brand="favorites"></i> \
                          Favorites \
                        </a> \
                      </li>`;
}
