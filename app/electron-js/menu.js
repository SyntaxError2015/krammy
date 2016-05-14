module.exports = {
    template: function() {
        var returnTemplate = template;

        if (isDevMode)
            returnTemplate.push(devModeMenu);

        return returnTemplate;
    },
    devMode: function(devMode) {
        isDevMode = devMode;
    },
    setCallbacks: function(cb) {
        callbacks = cb;
    }
};

var isDevMode = false;
var callbacks = {
    openFile: null,
    saveFile: null,
    saveFileAs: null,
    closeFile: null,
    exit: null
};

var template = [{
    label: 'File',
    submenu: [{
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: function() {
            callbacks.openFile()
        },
    }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function() {
            callbacks.saveFile()
        },
    }, {
        label: 'Save as',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function() {
            callbacks.saveFileAs()
        },
    }, {
        label: 'Close file',
        accelerator: 'CmdOrCtrl+Q',
        click: function() {
            callbacks.closeFile()
        },
    }, {
        type: 'separator'
    }, {
        label: 'Exit',
        accelerator: 'Alt+F4',
        click: function() {
            callbacks.exit()
        },
    }]
}, {
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
    }, {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
    }, {
        type: 'separator'
    }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
    }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
    }, ]
}, {
    label: 'Window',
    role: 'window',
    submenu: [{
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        // {
        //     label: 'Close',
        //     accelerator: 'CmdOrCtrl+W',
        //     role: 'close'
        // }, 
    ]
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'About',
        click: function() {
            require('electron').shell.openExternal('https://github.com/SyntaxError2015/krammy')
        }
    }, ]
}, ];


var devModeMenu = {
    label: 'DEV tools',
    submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.reload();
        }
    }, {
        label: 'Toggle Full Screen',
        accelerator: (function() {
            if (process.platform == 'darwin')
                return 'Ctrl+Command+F';
            else
                return 'F11';
        })(),
        click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
    }, {
        label: 'Toggle Developer Tools',
        accelerator: "F12",
        click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.webContents.toggleDevTools();
        }
    }, ]
};