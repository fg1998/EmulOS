function findEmulator(brandName, emulatorName) {
    const brand = jsonResult.emulators.brand.find((b) => b.name === brandName);
    if (brand) {
      var ret = brand.emulator.find((e) => e.name === emulatorName);
      return ret;
    }
    return null;
  }