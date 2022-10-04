const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow
let aboutWindow

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    // Make window bigger if isDev
    // width: isDev ? 1000 : 500,
    // x: 0,
    // y: 0,
    width: 768,
    height: 480,
    minWidth: 150,
    minHeight: 150,
    // SET ICON
    // icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },

    // HIDE TITLE BAR
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
    },
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Show devtools automatically if in development
  // if (isDev) {
  //   mainWindow.webContents.openDevTools()
  // }

  // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    title: 'About Electron',
    // SET ICON
    // icon: `${__dirname}/assets/icons/Icon_256x256.png`,

    frame: false,
    resizable: false,

    // HIDE TITLE BAR
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
    },
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'))
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null))
})

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
            {
              label: 'Quit',
              click: () => app.quit(),
              accelerator: 'CmdOrCtrl+Q',
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  // {
  //   label: 'File',
  //   submenu: [
  //     {
  //       label: 'Quit',
  //       click: () => app.quit(),
  //       accelerator: 'CmdOrCtrl+W',
  //     },
  //   ],
  // },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
