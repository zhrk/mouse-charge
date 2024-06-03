const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("getCharge", (_event, value) => {
    document.getElementById("charge").innerText = `${value}%`;
  });
});
