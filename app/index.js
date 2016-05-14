'use strict'

var converter = null;
var renderer = null;
var codeFormatter = null;
var hljs = null;
try {
    window.$ = window.jQuery = require('jquery');
    converter = require('./js/converter.js')
    converter = require('./js/converter.js');
    renderer = require('./js/renderer.js');
    codeFormatter = require('js-beautify').html;
    hljs = require('highlight.js')
} catch (error) {

}

$(document).ready(function() {
    highlightCode();
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

function textEdited(obj) {
    renderer.render($(obj)[0].innerText, updateHTML);
    // renderer.render($(obj).val(), updateHTML);
}

function updateHTML(htmlCode) {
    var cleanHtmlCode = codeFormatter(htmlCode);

    $('#html-generated').text(cleanHtmlCode);
    $('#html-rendered').html(htmlCode);

    highlightCode();
}

function highlightCode() {
    var kramdownContainer = $('.kramdown-container');
    var htmlContainer = $('.html-container');

    var caretPos = getCaretPosition(kramdownContainer[0]);

    hljs.highlightBlock(kramdownContainer[0]);
    hljs.highlightBlock(htmlContainer[0]);

    kramdownContainer.focus();
    setCaretPosition(kramdownContainer, caretPos);
}

function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    
    return caretPos;
}

function setCaretPosition(editableDiv, caretPos) {    
    var range = document.createRange();
    var sel = window.getSelection();
    
    range.setStart(editableDiv.firstChild, caretPos);
    range.collapse(true);
    
    $('#html-rendered').html("zzzzzzzzzzzzzzzzz");
    
        
    sel.removeAllRanges();
    sel.addRange(range);
    
    var car = getCaretPosition(editableDiv);
}