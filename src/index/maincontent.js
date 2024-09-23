// DRAW EMULATOR TILES (MAIN CONTENT)
export function doTiles(brandName, machineBrand) {
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
  const emulator = findEmulator(jsonResult, brand, name);
  emulator.brand = brand;
  ipcRenderer.send("configClick", emulator);
}

export function play(event) {
  const element = event.target;
  const brand = element.dataset.brand;
  const name = element.dataset.name;
  const emulator = findEmulator(jsonResult, brand, name);
  ipcRenderer.send("playClick", emulator);
}

function favorite(event) {
  const element = event.target;
  const selectBrand = element.dataset.brand;
  const name = element.dataset.name;
  const favorite = element.dataset.favorite;
  const emulator = findEmulator(jsonResult, selectBrand, name);

  emulator.favorite = favorite == "true" ? "false" : "true";

  /*
  const originalName = path.join(__dirname, "..", "emulators.json");
  const oldName = path.join(__dirname, ".", "emulators_old.json");
  fs.renameSync(originalName, oldName);
  fs.writeFileSync(originalName, JSON.stringify(jsonResult, null, 2));
*/

  saveConfig(jsonResult)
  const machineBrand = jsonResult.emulators.brand.find((brand) => brand.name == selectBrand).emulator;
  doTiles(selectBrand, machineBrand);
}
