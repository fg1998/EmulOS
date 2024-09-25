var path = require("path");
var fs = require("fs");
var XMLParser = require("fast-xml-parser");

export function findEmulator(jsonResult, brandName, emulatorName) {
  

  const emulator = jsonResult.find((emulator) => emulator.brand == brandName && emulator.name == emulatorName);
  if (emulator) {
    var ret = emulator
    return ret;
  }
  return null;
}
 export function getConfigFile() {
  var emulatorsFile = path.join(__dirname, "..", "emulators.json");
  var jsonFile = fs.readFileSync(emulatorsFile);
  var jsonResult = JSON.parse(jsonFile);
  return jsonResult;
}

export function saveConfigFile(jsonResult) {
  const originalName = path.join(__dirname, "..", "emulators.json");
  const oldName = path.join(__dirname, "..", "emulators_old.json");
  fs.renameSync(originalName, oldName);
  fs.writeFileSync(originalName, JSON.stringify(jsonResult, null, 2));
}


export function getConfig() {
  var ret = getConfigFile();
  return ret.config
}


