const { ipcRenderer } = require("electron");
var fs = require("fs");
var path = require("path");
var XMLParser = require("fast-xml-parser");

var theme = `./themes/es-theme-pixel/`


var emulatorsFile = path.join(__dirname, ".", "emulators.xml");
var emulatorsXML = fs.readFileSync(emulatorsFile);
const parser = new XMLParser.XMLParser();

// PARSEANDO O ARQUIVO XML E GERANDO OS CARDS DOS EMULADORES
const jsonResult = parser.parse(emulatorsXML);
const emulatorList = document.getElementById("emulator-list");

jsonResult.emulators.emulator.forEach((element, index) => {

  const icone = `${theme}/${element.type}/console.png`

  const card = `<div class='col-md-4 col-lg-3 file-card' id='button${index}'> \
  <div class='card shadow-sm'> \
    <div class='img-thumbnail'> \
        <img src='${icone}'  /> \
    </div>
    <div class='card-body'> \
      <p class='card-text'>${element.name}</p>  \
    </div> \
  </div>  \
</div> `;
  emulatorList.innerHTML = emulatorList.innerHTML + card;
});

jsonResult.emulators.emulator.forEach((element, index) => {
  var t = document.getElementById("button" + index);
  t.addEventListener("click", () => {
    ipcRenderer.send('emulatorClick', element)
  });
});
