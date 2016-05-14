'use strict'
var kramed = require('kramed');

var btn = document.getElementById('but');
var phtml = document.getElementById('p-html');
var praw = document.getElementById('p-raw-html');

btn.addEventListener('click', function() {
  // p.innerHTML = "ASJKFSHAFKJAS";
  // Async highlighting with pygmentize-bundled
  var data = kramed('HEADER\n============\n\nPARAGRAPH  \nLINE');
	phtml.innerHTML = data;
    praw.innerHTML = escapeHtml(data);
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
