const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });
  win.loadFile('./src/index.html');
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.whenReady().then(() => {
  createWindow();
  
  // Check if running on Windows and if it's the first run
  if (process.platform === 'win32') {
    const fs = require('fs');
    const os = require('os');
    
    // Create shortcut on desktop
    const shortcutPath = path.join(os.homedir(), 'Desktop', 'My Electron App.lnk');
    if (!fs.existsSync(shortcutPath)) {
      const shell = require('electron').shell;
      const WScript = require('electron').remote;
      const shortcut = WScript.CreateShortcut(shortcutPath);
      shortcut.TargetPath = process.execPath;
      shortcut.Save();
    }
  }
});

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