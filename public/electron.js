import electron from "electron";
import path from "path";

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
