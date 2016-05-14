const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

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
    Menu.setApplicationMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.maximize();
});
