'use strict'

var kramed = require('kramed');

var phtml = document.getElementById('p-html');
var praw = document.getElementById('p-raw-html');

$(document).ready(function() {
    $("#but").click(function() {
        var data = kramed('HEADER\n============\n\nPARAGRAPH  \nLINE');

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