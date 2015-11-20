// Require the logging library.
var logger = require('../util/logging-util');
var datamapping = require('../datamapping/google-datamapping');
var objutil = require('../util/object-util');

// Require the phantomJS libraries.
var wp = require('webpage');

const googleURL = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

function googleBookSearch (isbn, resultsCallback) {
    // Create a new "Tab"
	var google = wp.create();

    logger.debug("About to search using " + googleURL + isbn);
    // Open the API using the isbn.
	google.open(googleURL + isbn, function(status) {
		if (status == "success")
		{
            logger.debug("Found info on Google for " + isbn);
            // Parse the JSON returned by the server.
			data = JSON.parse(google.plainText);

            // Only continue if only one book was found because otherwise
            // there is a problem.
			if (data["totalItems"] == 1) {
                
                // Create a new object to hold the information and extract the
                // relevant parts from the returned json.
				var result = new Object();
				var book = data["items"][0]["volumeInfo"];
				                
				for (var index = 0; index < datamapping.columnNames.length; index++) {
                    column = datamapping.columnNames[index];
                    if (column in datamapping.columnProperty) {
                        result[column] = objutil.getAttribute(datamapping.columnProperty[column], book);
                    }
                    else {
                        result[column] = "";
                    }
                }
                
                result.isbn = isbn;
				result.title = objutil.getAttribute("title", book) + " " + objutil.getAttribute("subtitle", book);
                
                // Fix to fit in with ARBookFind
                result.lang = result.lang.toUpperCase();
				
                resultsCallback(result);
			}
			else {
                // If google didn't have an error but didn't return any information
                // then an error is printed and the isbn added to the unknown csv file.
				logger.debug("Book details not available on Google.");
                resultsCallback(null);
			}
		}
        else {
            logger.error("Unable to search for book on Google (" + status + ")");
            resultsCallback(null);
        }
		
        // Close the google 'tab' and restart for next search.
		google.close();	
	}); 
}


// Exports the functions for other modules.
module.exports.googleBookSearch = googleBookSearch;