const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  dialog,
} = require("electron");
const path = require("node:path");
const getCharge = require("./getCharge");
const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;

autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Available",
      message: "A new version is available. Do you want to update now?",
      buttons: ["Yes", "No"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Install and restart now?",
      buttons: ["Yes", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
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
  autoUpdater.checkForUpdates();

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
