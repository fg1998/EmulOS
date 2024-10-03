const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

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
  
    ipcMain.on("close-dialog-window", (event, param) => {
      if (dialogWindow) {
        dialogWindow.close();
        if (param) mainWindow.webContents.send("reload-tiles", param);
      }
    });
  }
  
  