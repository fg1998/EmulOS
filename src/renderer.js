const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");

var theme = `./themes/es-theme-pixel/`;

var emulatorsFile = path.join(__dirname, ".", "emulators.xml");
var emulatorsXML = fs.readFileSync(emulatorsFile);
const parser = new XMLParser.XMLParser();

// PARSEANDO O ARQUIVO XML E GERANDO OS CARDS DOS EMULADORES
const jsonResult = parser.parse(emulatorsXML);

// ADD brand buttons
jsonResult.emulators.brand.forEach((element, index) => {
  const item = `<li class='pure-menu-item'> \
                <a href='#' class='pure-menu-link'> <i class='fa fa-home'></i> ${element.name} </a> \
                </li>`;
  console.log(item);

  const li = document.createElement("li");
  li.className = "pure-menu-item";

  const a = document.createElement("a");
  a.href = "#";
  a.id = `button${index}`;
  a.dataset.brand = element.name
  a.className = "pure-menu-link";

  const icon = document.createElement("i");
  icon.className = "fa fa-home";

  a.appendChild(icon);
  a.appendChild(document.createTextNode(` ${element.name}`));
  li.appendChild(a);
  document.getElementById("brandMenu").appendChild(li);
});





// ADD CLICK EVENT O BRAND BUTTONS
jsonResult.emulators.brand.forEach((element, index) => {
  var t = document.getElementById("button" + index);
  t.addEventListener('click', function(event) {
    event.preventDefault();
    const brand = this.dataset.brand
    console.log(brand)
  })
})

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
