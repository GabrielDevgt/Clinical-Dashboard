const { app, BrowserWindow } = require('electron');
const path = require("node:path");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 900,
        minHeight: 500,
        webPreferences:{
            preload:path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
