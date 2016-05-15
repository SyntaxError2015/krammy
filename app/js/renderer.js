'use strict'

const converter = require('./converter.js');

var timer = null;
var timeout = 1000;

function render(markDownString, uiUpdateCallback) {
    return converter.convertToHtml(markDownString, uiUpdateCallback);
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
