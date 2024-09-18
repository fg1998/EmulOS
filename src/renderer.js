const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");
const { electron } = require("process");

//Parsing XML emulators File
var emulatorsFile = path.join(__dirname, ".", "emulators.xml");
var emulatorsXML = fs.readFileSync(emulatorsFile);
const parser = new XMLParser.XMLParser();
const jsonResult = parser.parse(emulatorsXML);

// ADD brand buttons
jsonResult.emulators.brand.forEach((element, index) => {
  const li = document.createElement("li");
  li.className = "pure-menu-item";
  li.dataset.brand = element.name;

  const a = document.createElement("a");
  a.href = "#";
  a.id = `button${index}`;
  a.dataset.brand = element.name;
  a.className = "pure-menu-link";

  const icon = document.createElement("i");
  icon.className = "fa fa-circle-o";
  icon.dataset.brand = element.name;

  a.appendChild(icon);
  a.appendChild(document.createTextNode(` ${element.name}`));
  li.appendChild(a);
  document.getElementById("brandMenu").appendChild(li);
});

// First Brand Selected when open dashboard
const firstBrand = jsonResult.emulators.brand[0].name;
const menuItem = document.querySelector(`li[data-brand='${firstBrand}']`);
menuItem.classList.add("pure-menu-selected-background");
const menuIcon = document.querySelector(`i[data-brand='${firstBrand}']`);
menuIcon.classList.remove("fa-circle-o");
menuIcon.classList.add("fa-circle");

const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == firstBrand);
doTiles(machineBrand);

// ADD CLICK EVENT TO BRAND BUTTONS
jsonResult.emulators.brand.forEach((element, index) => {
  var t = document.getElementById("button" + index);
  t.addEventListener("click", function (event) {
    event.preventDefault();

    selectedBrand = this.dataset.brand;

    //Remove pure-menu-selected-background from previous selected brand
    var previous = document.querySelector(".pure-menu-selected-background");
    if (previous) previous.classList.remove("pure-menu-selected-background");

    var previousIcon = document.querySelector(".fa-circle");
    if (previousIcon) {
      previousIcon.classList.remove("fa-circle");
      previousIcon.classList.add("fa-circle-o");
    }

    //Add selected-class to selected button
    const menuItem = document.querySelector(`li[data-brand='${selectedBrand}']`);
    menuItem.classList.add("pure-menu-selected-background");

    //Change selected icon
    const menuIcon = document.querySelector(`i[data-brand='${selectedBrand}']`);
    menuIcon.classList.remove("fa-circle-o");
    menuIcon.classList.add("fa-circle");

    //Select brand and do Tiles
    const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == selectedBrand);
    doTiles(machineBrand);
  });
});

function doTiles(brand) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  brand.emulator.forEach((element, index) => {

    const image = (element.image ? `./screen/${element.image}` : `./screen/${element.type}_not_found.png`)

    const card = `<div class="pure-u-sm-1-2 pure-u-md-1-3 card" style='position:relative'>
                    <img src="${image}" class="pure-img img-border">
                    <h4>${element.name}</h4>
                    <p>${element.desc}</p>
                    <div class="icons" style=''>
                      <i class="fa fa-star${element.favorite ? " selected" : "-o"}"></i>
                      <i class="fa fa-play"></i>
                      <i class="fa fa-gear"></i>
                      <i class="fa fa-trash"></i>
                    </div>
                  </div>`;

    content.innerHTML = content.innerHTML + card;
    console;
  });
}

//const emulatorList = document.getElementById("emulator-list");

/*
jsonResult.emulators.emulator.forEach((element, index) => {
  const icone = `${theme}/${element.type}/console.png`;

  const card = `<div class='col-md-4 col-lg-3 file-card' id='button${index}'> \
  <div class='card shadow-sm'> \
    <div class='img-thumbnail'> \
        <img src='${icone}'  /> \
    </div>
    <div class='card-body'> \
      <p class='card-text'>${element.name}</p>  \
    </div> \
    <button class='btn btn-primary'>RUN</button> \
  </div>  \
</div> `;
  emulatorList.innerHTML = emulatorList.innerHTML + card;
});

jsonResult.emulators.emulator.forEach((element, index) => {
  var t = document.getElementById("button" + index);
  t.addEventListener("click", () => {
    ipcRenderer.send("emulatorClick", element);
  });
});
*/
