const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("node:path");
const getCharge = require("./getCharge");
const { autoUpdater } = require("electron-updater");

// Auto-update event listeners
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update-available");
});

autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update-downloaded");
});

ipcMain.on("restart-app", () => {
  autoUpdater.quitAndInstall();
});

const electronFilesPath = path.join(process.cwd(), `.electron`);

app.setPath("appData", electronFilesPath);
app.setPath("logs", electronFilesPath);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 200,
    height: 200,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    backgroundColor: "#111111",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#111111",
      symbolColor: "#fff",
      height: 32,
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  const notification = new Notification({
    title: "Mouse charge",
    body: "Charging finished",
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle("getCharge", getCharge);
  ipcMain.handle("notify", () => notification.show());
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
