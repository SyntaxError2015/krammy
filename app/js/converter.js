'use strict'

var kramed = require('kramed');

function convertToHtml(kramdownString) {
    return kramed(kramdownString);
}

$(document).ready(function() {
    kramed.setOptions({
        renderer: new kramed.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
})

module.exports = {
    convertToHtml: convertToHtml
};