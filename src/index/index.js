const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const execFile = require("child_process").execFile;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}




 //HOT RELOAD
try {
  require('electron-reloader')(module, {
    ignore:['src/emulators*.json']
  })
} catch (_) {}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
 mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.maximize()
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



function createConfigWindow(content) { 

  configWindow = new BrowserWindow({ 
    width: 700, 
    height: 500, 
    modal: true, 
    show: false, 
    parent: mainWindow, // Make sure to add parent window here 
  
    // Make sure to add webPreferences with below configuration 
    webPreferences: { 
      nodeIntegration: true, 
      contextIsolation: false, 
      enableRemoteModule: true, 
    }, 
  }); 
  
  // Child window loads settings.html file 
  configWindow.loadFile(path.join(__dirname, "../config/config.html"), {query: {"data": JSON.stringify(content)}}); 
  
  configWindow.once("ready-to-show", () => { 
    configWindow.show(); 
  }); 

} 

ipcMain.on('configClick', (event, content) => {
  createConfigWindow(content);
})

ipcMain.on('close-child-window', (event, param) => {
  if (configWindow) {
    configWindow.close();
    mainWindow.webContents.send('reload-tiles', param);
  }
});

ipcMain.on("playClick", (event, content) => {

  //ROM PATH
  let parameter = content.parameter.replaceAll("${rompath}", content.config.rompath)
  
  const r = execFile(content.system.path, parameter.split(" "));
});
