const { app, BrowserWindow, ipcMain } = require("electron");
const { ipcRenderer } = require("electron");
const path = require("node:path");
const execFile = require('child_process').execFile
//require("./dialog.js");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

//HOT RELOAD
try {
  require("electron-reloader")(module, {
    //ignore: ["src/emulators*.json"],
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
  global.mainWindow = mainWindow;

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
ipcMain.on("playClick", async (event, content) => {
  console.log(content);
  //ROM PATH
  let parameter = content.parameter.replaceAll("${rompath}", content.config.rompath);

  paramList = content.emulator.param.split(' ');
  paramList.push(...parameter.split(' '));
  console.log(paramList)

  const emulatorProcess = execFile(content.emulator.path, paramList, (error, stdout, stderr)=> {
    if(error){
      console.log(' error ');
      console.log(error)
      const content = { width: 600, height: 450, type: "error", err: error };
      createDialogWindow(content);
      throw error
    }
    console.log(stdout)
  });

});




ipcMain.on("showDialogWindow", (event, content) => {
  createDialogWindow(content);
});

function createDialogWindow(_content) {
  dialogWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: _content.width,
    height: _content.height,
    modal: true,
    show: false,
    parent: global.mainWindow, // Make sure to add parent window here

    // Make sure to add webPreferences with below configuration
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // Child window loads settings.html file
  dialogWindow.loadFile(path.join(__dirname, `../${_content.type}/${_content.type}.html`), { query: { data: JSON.stringify(_content) } });

  dialogWindow.once("ready-to-show", () => {
    dialogWindow.show();
  });
}

ipcMain.on("close-dialog-window", (event, param) => {
  if (dialogWindow) {
    dialogWindow.close();
    if (param) mainWindow.webContents.send("reload-tiles", param);
  }
});
