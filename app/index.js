'use strict'

var renderer = null;
var codeFormatter = null;
var ipc = null;
var hljs = null;
try {
    renderer = require('./js/renderer.js');
    codeFormatter = require('js-beautify').html;
    hljs = require('highlight.js')
    ipc = require('electron').ipcRenderer;
} catch (error) {

}

//File status
var fileChanged = false;
var generateFullHtml = false;

var htmlContainer, kramdownContainer, renderedHtmlContainer;

$(document).ready(function() {
    htmlContainer = $('#html-generated');
    renderedHtmlContainer = $('#html-rendered')
    kramdownContainer = $('#kramdown-code');

    // Set ipc events
    setIpcEvents();

    // Supress tab in textarea
    kramdownContainer.keydown(function(e) {
        if (e.which == 9) {
            return false;
        }
    });

    // Initialize code components
    highlightContainers();
    kramdownContainer.val('# KRAMMY HEADER');
    textEdited(kramdownContainer);
});

function setIpcEvents() {
    //File open
    ipc.on('open-file', function(event, fileContent) {
        kramdownContainer.val(fileContent);
        textEdited(kramdownContainer);
    })

    ipc.on('get-file', function(event, arg) {
        var data = kramdownContainer.val();
        ipc.send('returned-file', data);
        fileChanged = false;
    })

    ipc.on('get-html-file', function(event, arg) {
        var data = htmlContainer.text();
        ipc.send('returned-file', data);
    })

    ipc.on('get-file-status', function(event, arg) {
        ipc.send('file-status', fileChanged);
    })

    ipc.on('close-file', function(event, arg) {
        kramdownContainer.val('');
        fileChanged = false;
        textEdited(kramdownContainer);
    })
}

function toggleGenerateFullHtml() {
    generateFullHtml = !generateFullHtml;

    textEdited(kramdownContainer);
}

function textEdited(obj) {
    renderer.render($(obj).val(), updateHTML);

    fileChanged = true;
}

function updateHTML(htmlCode) {
    if (isFullHtml()) {
        htmlCode = "<!DOCTYPE html><html><head></head><body>\n" + htmlCode + "</body></html>";
    }

    var cleanHtmlCode = codeFormatter(htmlCode);

    htmlContainer.text(cleanHtmlCode);
    renderedHtmlContainer.html(htmlCode);

    highlightContainers();
}

function highlightContainers() {
    hljs.highlightBlock(kramdownContainer[0]);
    hljs.highlightBlock(htmlContainer[0]);
}

function updateInterval(obj) {
    var delay = parseInt($(obj).val());
    if (!isNaN(delay))
        renderer.setTimeout(delay);
}