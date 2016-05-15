const fs = require('fs');

module.exports = function(dialog, mainWindow, ipc) {

    const extensions = ['txt'];

    function openFile() {
        dialog.showOpenDialog({
            filters: [{
                name: 'text',
                extensions: extensions
            }]
        }, function(fileNames) {
            if (fileNames == null || fileNames[0] == null) return;
            var fileName = fileNames[0];
            fs.readFile(fileName, 'utf-8', function(err, data) {
                if (err) {
                    dialog.showErrorBox('Error', 'Error opening the file!');
                }
                mainWindow.webContents.send('open-file', data);
                fileOpened = true;
                filePath = fileName;
            });
        });
    }

    function getFileContentAndSave(filePath, callback) {
        mainWindow.webContents.send('get-file', 'file');

        ipc.once('returned-file', function(event, fileContent) {
            fs.writeFile(filePath, fileContent, 'utf-8');
            if (callback)
                callback();
        });
    }

    var saveFileAs = function(callback) {
        const options = {
            title: 'Save kramdown file',
            filters: [{
                name: 'Kramdown files',
                extensions: extensions
            }]
        }
        dialog.showSaveDialog(options, function(file) {
            if (file == null) {

            } else {
                fileOpened = true;
                filePath = file;

                getFileContentAndSave(file, callback);
            }
        })
    }

    function saveFile(callback) {
        if (filePath != null && fileOpened) {
            //know where to save it
            getFileContentAndSave(filePath, callback);
        } else {
            //ask where to save it
            saveFileAs(callback);
        }
    }


    function exportHTML() {
        const options = {
            title: 'Save HTML file',
            filters: [{
                name: 'HTML file',
                extensions: ['html']
            }]
        }
        dialog.showSaveDialog(options, function(file) {
            if (file == null) {

            } else {
                mainWindow.webContents.send('get-html-file', 'file');

                ipc.once('returned-file', function(event, fileContent) {
                    fs.writeFile(file, fileContent, 'utf-8');
                });
            }
        })
    }


    function closeFile(callback) {
        mainWindow.webContents.send('get-file-status', 'file');

        ipc.once('file-status', function(event, fileChanged) {
            if (fileChanged) {
                const options = {
                    type: 'info',
                    title: 'File changed',
                    message: "The file has changed, do you want to save it?",
                    buttons: ['Yes', 'No']
                }
                dialog.showMessageBox(options, function(index) {
                    if (index == 0)
                        saveFile(function() {
                            mainWindow.webContents.send('close-file', index);
                            if (callback)
                                callback();
                        });
                    else {
                        mainWindow.webContents.send('close-file', index);
                        if (callback)
                            callback()
                    }
                });

            } else if (callback)
                callback()
        });
    }

    return {
        openFile: function() {
            closeFile(openFile)
        },
        saveFile: saveFile,
        saveFileAs: saveFileAs,
        closeFile: closeFile,
        getFilePath: function() {
            return filePath;
        },
        exportHTML: exportHTML
    };
}

var fileOpened = false;
var filePath = null;