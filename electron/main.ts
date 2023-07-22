import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

const fs = require('fs');

// const readFiles = async (directoryPath: string) => {
//   //console.log('READ FILES');
//   try {
//     const fileNames = fs.readdirSync(directoryPath).map((fileOrFolder: any) => {
//       const fullPath = path.join(directoryPath, fileOrFolder);
//       if (fs.statSync(fullPath).isDirectory()) {
//         return {
//           type: 'directory',
//           name: fileOrFolder,
//           children: readFiles(fullPath),
//           opened: false
//         };
//       } else {
//         return {
//           type: 'file',
//           name: fileOrFolder
//         };
//       }
//     });

//     //console.log(JSON.stringify(fileNames));

//     return fileNames;
//   } catch (error) {
//     console.error('Error reading folders:', error);
//     return [];
//   }
// };

const rootDirectory = {
  type: 'directory',
  name: '/',
  children: [],
  opened: false,
  level: 0,
  path: ''
};;

const readFiles = async (directoryPath: string, currentDirectory: any) => {
  const splitPath = directoryPath.split("/");
  rootDirectory.name = splitPath[splitPath.length - 1];
  rootDirectory.path = directoryPath;
  try {
    fs.readdirSync(directoryPath).map((fileOrFolder: any) => {
      const fullPath = path.join(directoryPath, fileOrFolder);
            if (fs.statSync(fullPath).isDirectory()) {
              currentDirectory.children.push({
                type: 'directory',
                name: fileOrFolder,
                children: [],
                opened: false,
                level: currentDirectory.level + 1,
                path: fullPath
              });

              readFiles(fullPath, currentDirectory.children[currentDirectory.children.length - 1]);
            } else {
              currentDirectory.children.push({
                type: 'file',
                name: fileOrFolder,
                level: currentDirectory.level + 1,
                path: fullPath
              });
            }
    });

    return rootDirectory;
  } catch (error) {
    console.error('Error reading folders:', error);
  }
};

ipcMain.handle('get-files', async (_event, dirPath) => {
  rootDirectory.children = [];

  return JSON.stringify(
    await readFiles(dirPath, rootDirectory)
  );
});

// readFiles("/Users/dimitrijevujcic/Desktop/Dimitrije/Bachelor\'s_degree/code-editor/test-project", rootDirectory);

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
    fullscreen: true
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

app.whenReady().then(createWindow);
