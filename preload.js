const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getCharge: () => ipcRenderer.invoke("getCharge"),
});
