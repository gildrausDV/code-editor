import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { spawn } from 'child_process';
import { parse } from 'java-parser';

const fs = require('fs');

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
  });

  win.webContents.openDevTools();

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
});

const rootDirectory = {
  type: 'directory',
  name: '/',
  children: [],
  opened: false,
  level: 0,
  path: ''
};

const readFiles = async (directoryPath: string, currentDirectory: any) => {
  const splitPath = directoryPath.split("/");
  currentDirectory.name = splitPath[splitPath.length - 1];
  currentDirectory.path = directoryPath;
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
                path: fullPath,
                sorted: false
              });

              readFiles(fullPath, currentDirectory.children[currentDirectory.children.length - 1]);
            } else {
              currentDirectory.children.push({
                type: 'file',
                name: fileOrFolder,
                level: currentDirectory.level + 1,
                path: fullPath,
                edited: false
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

function readFileAsync(filePath: any, encoding: any) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err: any, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

ipcMain.handle('read-file', async (_event, filePath) => {
  try {
    const fileContent = await readFileAsync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    return '';
  }
});

ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
  fs.writeFile(filePath, content, (err: any) => {
    if (err) {
      console.error('Error saving the file:', err);
    } else {
      console.log('File saved successfully.');
    }
  });
});

ipcMain.handle('open-project', async (_event) => {
  if (!win)
    return;
  
  const result = dialog.showOpenDialogSync(win, {
    properties: ['openDirectory'],
  });

  var selectedDirectory = "";

  if (result && result.length > 0) {
    selectedDirectory = result[0];
    console.log('Selected folder:', selectedDirectory);
  }

  return selectedDirectory;
});

ipcMain.handle('create-file', async (_event, dirPath: string) => {
  fs.writeFile(dirPath, "", (err: any) => {
    if (err) {
      console.error('Error creating the file:', err);
    } else {
      console.log('File created successfully.');
    }
  });
});

ipcMain.handle('create-folder', async (_event, dirPath: string) => {
  fs.mkdir(dirPath, { recursive: true }, (err: any) => {
    if (err) {
      console.error('Error creating the folder:', err);
    } else {
      console.log('Folder created successfully.');
    }
  });
});

ipcMain.handle('python-code-parser', async (_event, pythonCode: string) => {
  return new Promise((resolve: any, reject: any) => {
    const parserScriptPath = path.join(__dirname, '../src/parsers/python-parser.py');

    const pythonProcess = spawn('python3', [parserScriptPath, pythonCode]);
    let pythonStdout = '';
    let pythonStderr = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonStdout += data.toString();
      pythonStdout = JSON.parse(pythonStdout);
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonStderr += data.toString();
    });

    pythonProcess.on('exit', (code) => {
        if (code === 0) {
          resolve(pythonStdout);
        } else {
          reject(new Error(`Python process exited with code ${code}: ${pythonStderr}`));
        }
    });
  });
});

ipcMain.handle('java-code-parser', (_event, javaCode: string) => {
  var parsedResult: any = '';
  try {
    parsedResult = parse(javaCode);
    console.log(parsedResult.children.ordinaryCompilationUnit[0]);
  } catch (error) {
      console.error('Java code parsing error:', error);
  }
  return 'parsedResult';
});

app.whenReady().then(createWindow);
