import { findEmulator, getConfig, saveConfigFile } from "../util.js";
const { ipcRenderer } = require("electron");

export function doTiles(brandName, machineBrand) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  machineBrand.forEach((element) => {
    const image = element.image ? `../assets/screenshots/${element.image}` : `../assets/screenshots/${element.type}_not_found.png`;

    // Criar o card
    const card = document.createElement("div");
    card.classList.add("pure-u-sm-1-2", "pure-u-md-1-3", "card");
    card.style.position = "relative";

    // Imagem
    const img = document.createElement("img");
    img.src = image;
    img.classList.add("pure-img", "img-border");

    // Título
    const h4 = document.createElement("h4");
    h4.textContent = element.name;

    // Descrição
    const p = document.createElement("p");
    p.textContent = element.desc;

    // Div para os ícones
    const iconsDiv = document.createElement("div");
    iconsDiv.classList.add("icons");

    // Criar o ícone Play
    const playIcon = document.createElement("i");
    playIcon.classList.add("btn-play", "fa", "fa-play");
    playIcon.dataset.brand = brandName;
    playIcon.dataset.name = element.name;
    playIcon.addEventListener("click", play); // Adiciona o evento 'play'

    // Criar o ícone Favorite
    const favoriteIcon = document.createElement("i");
    var tClass = `fa-star${element.favorite == "true" ? "selected" : "-o"}`
    if(element.favorite == 'true'){
      favoriteIcon.classList.add('btn-favorite','fa','fa-star','selected')
    } else {
      favoriteIcon.classList.add('btn-favorite','fa','fa-star-o')
    }
    //favoriteIcon.classList.add("btn-favorite", "fa", `fa-star${element.favorite == "true" ? " selected" : "-o"}`);
    favoriteIcon.dataset.favorite = element.favorite;
    favoriteIcon.dataset.brand = brandName;
    favoriteIcon.dataset.name = element.name;
    favoriteIcon.addEventListener("click", favorite); // Adiciona o evento 'favorite'

    // Criar o ícone Config
    const configIcon = document.createElement("i");
    configIcon.classList.add("btn-config", "fa", "fa-gear");
    configIcon.dataset.brand = brandName;
    configIcon.dataset.name = element.name;
    configIcon.addEventListener("click", config); // Adiciona o evento 'config'

    // Criar o ícone Remove
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("btn-remove", "fa", "fa-trash");
    removeIcon.dataset.brand = brandName;
    removeIcon.dataset.name = element.name;
    removeIcon.addEventListener("click", remove); // Adiciona o evento 'remove'

    // Adicionar os ícones à div icons
    iconsDiv.appendChild(playIcon);
    iconsDiv.appendChild(favoriteIcon);
    iconsDiv.appendChild(configIcon);
    iconsDiv.appendChild(removeIcon);

    // Adicionar os elementos ao card
    card.appendChild(img);
    card.appendChild(h4);
    card.appendChild(p);
    card.appendChild(iconsDiv);

    // Adicionar o card ao conteúdo
    content.appendChild(card);
  });
}

// DRAW EMULATOR TILES (MAIN CONTENT)
export function doTiles2(brandName, machineBrand) {
  //const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == brandName);
  const content = document.getElementById("content");
  content.innerHTML = "";

  machineBrand.forEach((element, index) => {
    const image = element.image ? `../assets/screenshots/${element.image}` : `../assets/screenshots/${element.type}_not_found.png`;
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
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const emulator = findEmulator(getConfig(), brand, name);
  emulator.brand = brand;
  ipcRenderer.send("configClick", emulator);
}

export function play(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const emulator = findEmulator(getConfig(), brand, name);
  ipcRenderer.send("playClick", emulator);
}

function favorite(event) {
  const element = event.target;
  const selectBrand = element.dataset.brand;
  const name = element.dataset.name;
  const favorite = element.dataset.favorite;

  let jsonResult = getConfig();
  const emulator = findEmulator(jsonResult, selectBrand, name);

  emulator.favorite = favorite == "true" ? "false" : "true";

  /*
  const originalName = path.join(__dirname, "..", "emulators.json");
  const oldName = path.join(__dirname, ".", "emulators_old.json");
  fs.renameSync(originalName, oldName);
  fs.writeFileSync(originalName, JSON.stringify(jsonResult, null, 2));
*/

  saveConfigFile(jsonResult);
  const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == selectBrand).emulator;
  doTiles(selectBrand, machineBrand);
}

function remove(event) {
  console.log("Todo");
}
