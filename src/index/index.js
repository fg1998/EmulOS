const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
require('./dialog.js')

const execFile = require("child_process").execFile;
const exec = require('child_process').exec

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

//HOT RELOAD
try {
  require("electron-reloader")(module, {
    ignore: ["src/emulators*.json"],
  });
} catch (_) {}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: path.join(process.cwd(), "src/assets", "icon.icns"),
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Set mainwindow as global to be acessed by dialog.js
  global.mainWindow = mainWindow

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.maximize();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


/////////////////////////////
// PLAY BUTTON
////////////////////////////

ipcMain.on("playClick", (event, content) => {
  console.log('play')
  //ROM PATH
  let parameter = content.parameter.replaceAll("${rompath}", content.config.rompath);

  const r = exec(content.system.path, parameter.split(" "), (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
    console.log(r);
  });
});
