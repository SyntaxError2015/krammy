const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;

const dialog = require('electron').dialog;


var mainWindow = null;



app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        darkTheme: true
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
    });


    // Work with files
    var filesModule = require('./electron-js/files.js')(dialog, mainWindow, ipc);

    //set the application menu
    const menuBuilder = require('./electron-js/menu.js');
    menuBuilder.devMode(true);
    menuBuilder.setCallbacks({
        openFile: filesModule.openFile,
        saveFile: filesModule.saveFile,
        saveFileAs: filesModule.saveFileAs,
        closeFile: filesModule.closeFile,
        exit: function() {
            filesModule.closeFile(
                function() {
                    app.quit();
                }
            );
        }
    });

    var menu = Menu.buildFromTemplate(menuBuilder.template());
    Menu.setApplicationMenu(menu);

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.maximize();

    // mainWindow.webContents.toggleDevTools();



});