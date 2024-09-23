var path = require("path");
var fs = require("fs");
var XMLParser = require("fast-xml-parser");

export function findEmulator(jsonResult, brandName, emulatorName) {
  const brand = jsonResult.emulators.brand.find((b) => b.name === brandName);
  if (brand) {
    var ret = brand.emulator.find((e) => e.name === emulatorName);
    return ret;
  }
  return null;
}
 export function getConfig() {
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



