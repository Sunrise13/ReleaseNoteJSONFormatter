/**
 * Created by oromanko on 7/6/15.
 */

var fs = require('fs');
var readline = require('readline');

var releaseNotesPath = process.argv[2];
var releaseNotesTypes = {
    new: "NEW",
    change: "CHANGE"
};

var stream = fs.createReadStream(releaseNotesPath);

var rd = readline.createInterface({
    input: stream
});

var releaseNotesObj = { data: [] };

function Note() {
    this.items = {
        NEW: [],
        CHANGES: []
    };
    this.date = null;
};

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
    if(line.match(/^NEW/)) {
        noteStr = line.replace(new RegExp("^" + releaseNotesTypes.new + ": "), "");
        noteObj.items.NEW.push(noteStr);
        return;
    }
    if(line.match(/^CHANGE/)) {
        noteStr = line.replace(new RegExp("^" + releaseNotesTypes.change + ": "), "");
        noteObj.items.CHANGES.push(noteStr);
        return;
    }
});

rd.on('close', function(line) {
    console.log(JSON.stringify(releaseNotesObj));
    fs.writeFile(process.argv[2].replace(/\.[^/.]+$/, ".json") ,JSON.stringify(releaseNotesObj), function (err) {
        if(err)
            throw err;
    });
});