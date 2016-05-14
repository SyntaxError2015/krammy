'use strict'

const converter = require('./converter.js');

function resetTimer() {
}

function wait() {

}

function render(markDownString, uiUpdateCallback) {
    var htmlCode = converter.convertToHtml(markDownString);

    return uiUpdateCallback(htmlCode);
}

module.exports = {
    render: function(markDownString, uiUpdateCallback) {
        resetTimer();
        wait();

        render(markDownString, uiUpdateCallback)
    }
}
