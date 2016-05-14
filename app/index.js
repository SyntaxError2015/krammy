'use strict'

var converter = null;
var renderer = null;
try {
    window.$ = window.jQuery = require('jquery');
    converter = require('./js/converter.js');
    renderer = require('./js/renderer.js');
} catch (error) {

}

$(document).ready(function() {
    $("#but").click(function() {
        var data = converter.convertToHtml('HEADER\n============\n\nPARAGRAPH  \nLINE');

        $('#p-html').html(data);
        $('#p-raw-html').text(data);
    });

    var i = 0;
    var dragging = false;
    $('#dragbar').mousedown(function(e) {
        e.preventDefault();

        dragging = true;
        var main = $('#main');
        var ghostbar = $('<div>', {
            id: 'ghostbar',
            css: {
                height: main.outerHeight(),
                top: main.offset().top,
                left: main.offset().left
            }
        }).appendTo('body');

        $(document).mousemove(function(e) {
            ghostbar.css("left", e.pageX + 2);
        });
    });

    $(document).mouseup(function(e) {
        if (dragging) {
            var percentage = (e.pageX / window.innerWidth) * 100;
            var mainPercentage = 100 - percentage;

            $('#console').text("side:" + percentage + " main:" + mainPercentage);

            $('#sidebar').css("width", percentage + "%");
            $('#main').css("width", mainPercentage + "%");
            $('#ghostbar').remove();
            $(document).unbind('mousemove');
            dragging = false;
        }
    });
});

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
    }
    else {
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

function textEdited(obj) {
    var markDownString = $(obj).val();
    renderer.render(markDownString, updateHTML);
}

function updateHTML(htmlCode) {
    $('#html-generated').text(htmlCode);
    $('#html-rendered').html(htmlCode);
}