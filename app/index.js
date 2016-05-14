'use strict'

var renderer = null;
var codeFormatter = null;
var ipc = null;
try {
    window.$ = window.jQuery = require('jquery');
    renderer = require('./js/renderer.js');
    codeFormatter = require('js-beautify').html;
    ipc = require('electron').ipcRenderer;
} catch (error) {

}

function resizeBarMouseDown(e, obj) {
    e.preventDefault();

    var bar = $(obj);
    var sidebar = $(obj).parent();
    var container = sidebar.parent();
    var main = sidebar.next();

    var isVertical = bar.attr('class').indexOf('-vertical') > 0;

    var ghostbar = null;
    if (isVertical) {
        ghostbar = $('<div>', {
            id: 'ghostbar',
            css: {
                height: bar.height(),
                top: 0,
                left: sidebar.width() - bar.width(),
                width: bar.width(),
                cursor: 'col-resize'
            }
        }).appendTo(container);
    } else {
        ghostbar = $('<div>', {
            id: 'ghostbar',
            css: {
                height: bar.height(),
                top: sidebar.height() - bar.height(),
                left: 0,
                width: bar.width(),
                cursor: 'row-resize'
            }
        }).appendTo(container);
    }

    $(document).mousemove(function(e) {
        if (isVertical)
            ghostbar.css("left", e.pageX - container.position().left - ghostbar.width() / 2);
        else
            ghostbar.css("top", e.pageY - container.offset().top - ghostbar.height() / 2);
    });


    //bind on mouseup
    $(document).mouseup(function(e) {
        var percentage = 0;

        if (isVertical)
            percentage = ((e.pageX - container.position().left + ghostbar.width() / 2) / container.width()) * 100;
        else
            percentage = ((e.pageY - container.offset().top + ghostbar.height() / 2) / container.height()) * 100;

        var mainPercentage = 100 - percentage;

        if (isVertical) {
            sidebar.css("width", percentage + "%");
            main.css("width", mainPercentage + "%");
        } else {
            sidebar.css("height", percentage + "%");
            main.css("height", mainPercentage + "%");
        }
        $('#ghostbar').remove();
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
    });

}

//File status
var fileChanged = false;

//File open
ipc.on('open-file', function(event, fileContent) {
    // document.getElementById('open-file').innerHTML = `You selected: ${path}`
    $('#kramdown-code').val(fileContent);
    textEdited($('#kramdown-code'));
})

ipc.on('get-file', function(event, arg) {
    var data = $('#kramdown-code').val();
    ipc.send('returned-file', data);
    fileChanged = false;
})

ipc.on('get-file-status', function(event, arg) {
    ipc.send('file-status', fileChanged);
})

ipc.on('close-file', function(event, arg) {
    $('#kramdown-code').val('');
    fileChanged = false;
})

function textEdited(obj) {
    renderer.render($(obj).val(), updateHTML);
    fileChanged = true;
}

function updateHTML(htmlCode) {
    var cleanHtmlCode = codeFormatter(htmlCode);

    $('#html-generated').text(cleanHtmlCode);
    $('#html-rendered').html(htmlCode);
}