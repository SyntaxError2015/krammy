'use strict'

var kramed = require('kramed');

function convertToHtml(kramdownString, uiUpdateCallback) {
    return kramed(kramdownString, function(err, content) {
        if (err) throw err;

        uiUpdateCallback(content);
    });
}

$(document).ready(function() {
    kramed.setOptions({
        renderer: new kramed.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: true
    });
})

module.exports = {
    convertToHtml: convertToHtml
};