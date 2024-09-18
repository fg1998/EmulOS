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

// ADD brand buttons (Lateral Menu Itens)
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
    //doActionButtons(machineBrand)
  });
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
//doActionButtons(machineBrand)

function doTiles(machineBrand) {
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
  const name = element.dataset.name
  const emulator = findEmulator(brand, name)
  ipcRenderer.send("playClick", emulator);
  

}

function favorite(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name
  const favorite = element.dataset.favorite
  console.log(brand, name, favorite)
}


function findEmulator(brandName, emulatorName){
  const brand = jsonResult.emulators.brand.find(b => b.name === brandName);
  if (brand) {
    return brand.emulator.find(e => e.name === emulatorName);
  }
  return null;
};

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
