var kramdownContainer;

$(document).ready(function() {
    kramdownContainer = $('#kramdown-code');
});

function isTextSelected(callback) {
    var text = kramdownContainer.getSelection().text;
    if (text != null && text.length > 0) {
        var newText = callback(text);
        kramdownContainer.replaceSelectedText(newText);
        textEdited(kramdownContainer);
    }
}

function makeBold() {
    isTextSelected(function(text) {
        return "**" + text + "**";
    });
}

function makeItalic() {
    isTextSelected(function(text) {
        return "_" + text + "_";
    });
}

function makeH1() {
    isTextSelected(function(text) {
        return text + "\n" + "=".repeat(text.length);
    });
}

function makeH2() {
    isTextSelected(function(text) {
        return text + "\n" + "-".repeat(text.length);
    });
}

function makeH3() {
    isTextSelected(function(text) {
        return "### " + text;
    });
}