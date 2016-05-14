'use strict'

const converter = require('./converter.js');

var timer = null;
var timeout = 1000;

function render(markDownString, uiUpdateCallback) {
    var htmlCode = converter.convertToHtml(markDownString);

    return uiUpdateCallback(htmlCode);
}

module.exports = {
    render: function(markDownString, uiUpdateCallback) {
        if (timer != null) {
            clearTimeout(timer);
        }
        
        timer = setTimeout(render, timeout, markDownString, uiUpdateCallback);
    },
    
    setTimeout: function(timeoutValue) {
        timeout = timeoutValue;
    },
    
    getTimeout: function() {
        return timeout;
    }
}
