var core = require('../core/arfinder-core');
var csvutil = require('../core/util/csv-util.js');
var system = require('system');
var fs = require('fs');

// Check if we are going to be making a new file - must be a better way.
var newFile = (!fs.exists("libraryDB.csv"));

// Opens both csv files (this automatically creates them if they don't exist).
var bookDB = fs.open('libraryDB.csv', 'a');
var unknownBookDB = fs.open('libraryUnknownDB.csv', 'a');

// If it was a new file then write in the column headings.
if (newFile) {
	csvutil.setupCSV(bookDB)
}

function writeCSV(result) {
    if (!result)
        return;
    
    if (Object.keys(result).length > 1) {
        bookDB.write(csvutil.json2csv(result));
    }
    else {
        unknownBookDB.write(result.isbn + "\r\n");
    }
    
}

function doSearch () {
    system.stdout.write('ISBN: ');
    
    // Remove any hypens and trailing white spaces.
	isbn = system.stdin.readLine();
    
    if (isbn == "")
    {
        bookDB.close();
        unknownBookDB.close();
        core.endSearch();	        
    }
    
    core.searchByISBN(isbn, function(result) {
        if (result) {
            writeCSV(result);
        }
        
        doSearch();
            
    });
}

core.initSearch(doSearch);
