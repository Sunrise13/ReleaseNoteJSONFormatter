/**
 * Created by oromanko on 7/6/15.
 */

var fs = require('fs');
var readline = require('readline');

var releaseNotesPath = process.argv[2];
var releaseNotesTypes = {
    'new': "NEW",
    'change': "CHANGE"
};

var stream = fs.createReadStream(releaseNotesPath);
var rd = readline.createInterface({
    input: stream
});

var releaseNotesObj = { data: [] };

function Note() {
    this.items = {};
    this.date = null;
}

var noteObj = new Note();

rd.on('line', function (line) {
    if(line === "") {
        releaseNotesObj.data.push(noteObj);
        noteObj = new Note();
        return;
    }
    if(!isNaN((Date.parse(line.trim())))) {
        noteObj.date = line;
        return;
    }
    var noteStr;
    var regExp = new RegExp("^\\b" + releaseNotesTypes.new + "\\b|\\b" + releaseNotesTypes.change + "\\b");
    var noteType = line.match(regExp);
    if(noteType) {
        noteStr = line.replace(noteType[0] + ': ', "");
        noteObj.items[noteType[0]] = noteObj.items[noteType[0]] || [];
        noteObj.items[noteType[0]].push(noteStr);
    }
});

rd.on('close', function() {
    fs.writeFile(process.argv[2].replace(/\.[^/.]+$/, ".json") ,JSON.stringify(releaseNotesObj), function (err) {
        if(err)
            throw err;
    });
});