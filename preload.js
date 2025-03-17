const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getCharge: () => ipcRenderer.invoke("getCharge"),
  notify: () => ipcRenderer.invoke("notify"),
});

ipcRenderer.on("update-available", () => {
  alert("A new update is available. Downloading now...");
});

ipcRenderer.on("update-downloaded", () => {
  const userResponse = confirm("Update downloaded. Restart now?");
  if (userResponse) {
    ipcRenderer.send("restart-app");
  }
});
