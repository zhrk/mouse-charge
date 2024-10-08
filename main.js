const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const getCharge = require("./getCharge");

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

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle("getCharge", getCharge);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
