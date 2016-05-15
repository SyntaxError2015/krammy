const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;

var mainWindow = null;


app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        minWidth: 900,
        minHeight: 650,
        center: true,
        darkTheme: true,
        title: 'Krammy',
        icon: __dirname + '/images/icon.png'
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
        exportHTML: filesModule.exportHTML,
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
});