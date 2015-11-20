// Require the logging library.
var logger = require('../util/logging-util');
var datamapping = require('../datamapping/arfinder-datamapping');

function bookDetailsHandler (page, isbn, callback) {
    return function (status) {
        if (status == "success") {
            logger.debug("Processing results for " + isbn);
            var result = page.evaluate(function(isbn, datamapping) {
                // Makes a new object and retrieved the information off the page for the various
                // attributes - fortunately the ARBookFind site is very well organised.
                var result = new Object();
                
                for (var index = 0; index < datamapping.columnNames.length; index++) {
                    column = datamapping.columnNames[index];
                    if (column in datamapping.columnHTMLId) {
                        result[column] = document.getElementById(datamapping.columnHTMLId[column]).textContent;
                    }
                    else {
                        result[column] = "";
                    }
                }
                
                result.isbn = isbn;
                result.ranking = document.getElementById(datamapping.rankHTMLId).firstChild.getAttribute("alt");
                var table = document.getElementById(datamapping.publisherTblHTMLId);
				var rows = table.children[0].children;
				for (var index = 1; index < rows.length; index++) { 
					if (rows[index].children[1].textContent.replace(/-/g, "").trim() == isbn)
					{
						result.publisher = rows[index].children[0].textContent.trim();
						result.publishedDate = rows[index].children[2].textContent.trim();
						result.pages = rows[index].children[3].textContent.trim();
					}
				}

                return result;
            }, isbn, datamapping);

            callback(result);
        }
        else {
            log.error("Unable to retrieve the book details (" + status + ")");
        }
    };
}


function searchResultsHandler (page, isbn, callback) {
    return function (status) {
        if (status == "success") {
            logger.debug ("Found results for " + isbn + ".")
            page.onLoadFinished = bookDetailsHandler(page, isbn, callback);

            // Selects the first book link on the search results page and
            // simulates a click on it to get to the detailed results.
            if (!page.evaluate(function() {
                    var dom = document.querySelectorAll("[class=link_bold]");
                    if (dom.length == 1)
                    {
                        dom[0].click();
                        return true;
                    }

                    return false;
                }))
            {
                logger.debug("Book details not available on AR Book Finder.");
                callback (null);
            }
        }
        else {
            logger.error("Unable to get the search results (" + status + ")");
            callback (null);
        }
    };
}


function arBookSearch (page, isbn, callback) {
    logger.debug("Starting serach for " + isbn);
    page.onLoadFinished = searchResultsHandler (page, isbn, callback);
    
    page.evaluate(function(bookISBN) {
        // Simulate entering the ISBN into the search box and clicking the button.
		document.getElementById('ctl00_ContentPlaceHolder1_txtKeyWords').value = bookISBN;
		document.getElementById('ctl00_ContentPlaceHolder1_btnDoIt').click();
	}, isbn);
}


// Exports the functions for other modules.
module.exports.arBookSearch = arBookSearch;