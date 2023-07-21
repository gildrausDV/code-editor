import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

const fs = require('fs');

const readFiles = (directoryPath: string) => {
  console.log('READ FILES');
  try {
    const fileNames = fs.readdirSync(directoryPath).map((fileOrFolder: any) => {
      const fullPath = path.join(directoryPath, fileOrFolder);
      if (fs.statSync(fullPath).isDirectory()) {
        return {
          type: 'directory',
          name: fileOrFolder,
          children: readFiles(fullPath),
        };
      } else {
        return {
          type: 'file',
          name: fileOrFolder,
        };
      }
    });

    console.log(fileNames);

    return fileNames;
  } catch (error) {
    console.error('Error reading folders:', error);
    return [];
  }
};

ipcMain.on('read-files', (event, dirPath) => {
  try {
    // Read all files and folders from the specified path recursively
    const files = readFiles(dirPath);

    // Send the files array back to the renderer process
    event.sender.send('files-read', files);
  } catch (error) {
    console.error('Error reading folders:', error);
    // Send an empty array or an error message back to the renderer process if needed
    event.sender.send('files-read', []);
  }
});


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
