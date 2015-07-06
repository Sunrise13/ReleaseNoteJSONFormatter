/**
 * Created by oromanko on 7/6/15.
 */

var fs = require('fs');

var releaseNotesPath = process.argv[2];
var releaseNotesTypes = {
    new: "NEW",
    change: "CHANGE"
};

fs.readFile(releaseNotesPath, function (err, data) {
    if (err)
        throw err;
    var bufText = data.toString().trim();
    var notesText = bufText.split('\r\n\r\n');
    var releaseNotesObj = { data: [] };

    for (var noteText in notesText) {
        if(notesText.hasOwnProperty(noteText)) {

            var note = {
                items: {},
                date: null
            };
            var noteArr = notesText[noteText].split('\r\n');

            note.date = !isNaN(Date.parse(noteArr[0])) ? noteArr[0] : "";

            var startWithStr = new RegExp("^" + releaseNotesTypes.new + ":");
            for (var i = 1; i<noteArr.length; i++) {
                if (noteArr[i].match(startWithStr)) {
                    note.items.NEW = note.items.NEW || [];
                    note.items.NEW.push({
                        type: 'NEW',
                        note: noteArr[i].replace(startWithStr, "")
                    });
                }
                startWithStr = new RegExp("^" + releaseNotesTypes.change + ":");
                if (noteArr[i].match(startWithStr)) {
                    note.items.CHANGES = note.items.CHANGES || [];
                    note.items.CHANGES.push({
                        type: 'CHANGES',
                        note: noteArr[i].replace(startWithStr, "")
                    });
                }
            }
            releaseNotesObj.data.push(note);
        }
    }

    fs.writeFile(process.argv[2].replace(/\.[^/.]+$/, ".json") ,JSON.stringify(releaseNotesObj), function (err) {
        if(err)
            throw err;
    });
});