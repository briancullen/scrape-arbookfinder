// Require the logging library.
var logger = require('./util/logging-util')

// Require the phantomJS libraries.
var wp = require('webpage');

// Require the handlers for the different pages/APIs.
var handlers = require("./handlers/handlers.js");
var isbnutils = require('./util/isbn-util');

const arReaderURL = 'http://www.arbookfind.co.uk';

// Create the main 'tab' to be used.
var page = wp.create();

// Called to shutdown the phantom host.
function endSearch () {
    page.close();
    phantom.exit();
}

function initSearch (statusCallback) {
    // Open the main page and simulate clicking on the
    // teacher option to set the cookie and get to the
    // main search page.
    page.open(arReaderURL, function(status) {
        if (status == "success")
        {
            logger.debug("Connected to " + arReaderURL);

            // This is called once the submit button is pressed below.
            page.onLoadFinished = function (status) {
                if (status != "success") {
                    logger.error("Unable to log in as teacher ("+status+")");
                    modules.exports.endPhantom();
                    return;
                }
                
                logger.debug("Logged in as a teacher to " + arReaderURL);
                statusCallback(status)
            };

            // Simulates clicking on the teacher option and pressing submit.
            page.evaluate(function(){
                document.getElementById('radTeacher').checked = true;
                document.getElementById('btnSubmitUserType').click();
            });		
        }
        else {
            logger.error("Unable to connect to " + arReaderURL + " ("+status+")");
        }

    });
}

function doHandlers(page, isbn, resultCallback) {
    var index = 0;
    var handlersFunction = function (result) {
        if (!result) {
           index += 1;
            
            if (index < handlers.length) {
                handlers[index](page,isbn,handlersFunction);
            }
            else {
                result = {};
                result.isbn = isbn;
                resultCallback(result);
            }
        }
        else {
            resultCallback(result);
            return;
        }
        
    }
    handlers[index](page, isbn, handlersFunction);
}

function searchByISBN (isbn, resultsCallback) {

    // If there is nothing to consume the
    // result whats the point.
    if (!resultsCallback)
    {
        return;
    }
    
    isbn = isbnutils.normaliseISBN(isbn);
    if (isbn == null)
    {
        logger.debug("Invalud ISBN (" + isbn + ")");
        resultsCallBack(null);
        return;
        
    }
    
    // Reset the main page back to the search.
    page.onLoadFinished = function () {};
    page.open(arReaderURL, function (status) {
        if (status != "success") {
            logger.error("Cannot open " + arReaderURL);
            resultsCallback(null);
            return;
        }

        // Search the arBookSearch site and it it fails fall back
        // to the google search.
        doHandlers(page, isbn, resultsCallback);
    });
}

// Exports the functions for other modules to use.
module.exports.endSearch = endSearch;
module.exports.initSearch = initSearch;
module.exports.searchByISBN = searchByISBN;
module.exports.logger = logger;

