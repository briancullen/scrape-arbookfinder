var core = require('../core/arfinder-core');
var system = require('system');

function doSearch () {   
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
            print(JSON.stringify(result));
        }
        else {
            print("{ error: 'Unable to process request' }")
        }
        
        doSearch();
            
    });
}

core.initSearch(doSearch);