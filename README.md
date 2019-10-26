ARBookFinder Scraper
====================

[![Build Status](https://travis-ci.org/briancullen/scrape-arbookfinder.svg)](https://travis-ci.org/briancullen/scrape-arbookfinder)

** While it all seems to work now this is definitely a work in progress. **

For the accelerated reader program it is necessary to know the points and other details for the books students are reading. These can be found on arbookfind.co.uk but when trying to catalog a large number of books the fact that the website does not support an API presents a difficulty. Indeed the site requires a cookie to be set to access the search engine.

This repository holds my various efforts to overcome this limitation. The aim of the code here is to take an ISBN (either typed or scanned) and look up a books details. This is achieved by using *phantomjs* to scrape their website and return the information in a usable format. As a fallback the scripts will also try and access the Google Books API if no information is found on the arbookfind website.

Currently I'm experimenting with two different methods of both invoking the program and formatting the result. These may be joined together in one script at some point but at the moment I have kept them seperate. The methods are as follows:

 * Command Line - CSV: Access via command line with results saved to CSV file.
 * HTTP - JSON: Access via HTTP request with results returned as JSON.
 
Prerequistes
------------
* PhantonJS ( http://phantomjs.org/ ) - running with 2.0.1-development but should run with most versions.

Example Output
--------------
Below is an abbreviated version of the JSON output that is produced by the program. This is what you will be given as a result if you write your own handlers or use the http server version. The CSV client merely takes this information and inserts it, unchanged, into a CSV file. If no information is found for a particular property it will still be added. However if no information is found on the book at all then only the isbn will be returned and no other properties will be set.

```js
{
  "author": "Rowling, J.K. ",
  "category": "Fiction",
  "imageURL": "http://somewhere.com/image.jpg",
  "interest": "Middle Years",
  "isbn": "9750747532743",
  "lang": "EN",
  "level": "2.0",
  "pages": "223",
  "points": "19.0",
  "publishedDate": "1997",
  "publisher": "Bloomsbury Publishing",
  "quizNumber": "210738",
  "ranking": "3",
  "series": "Harry Potter; ",
  "summary": "Harry thinks he is an ordinary boy till he finds out he is a wizard. First in the series.",
  "title": "Harry Potter and the Philosopher's Stone",
  "topic": "Award Winners/Nominee...",
  "words": "77325"
}
```

Command Line - CSV
------------------

While the code for this approach is not pretty it does work. Once the script is invoked with *phantomjs* it will prompt you for a ISBN to lookup. The resulting information will only be summarised on the console - the book title will appear if it was found. All other information is saved into one of two files that are created in the current working directory of the script.

 * **libraryDB.csv** - this contains all the information on books that could be found.
 * **libraryUnknownDB.csv** - this contains the ISBN numbers of books for which no information could be found.
 
The script will ask for a new ISBN after each search. To end the script just enter a blank ISBN.

###Executing

```
phantomjs arfinder-cli-csv.js
```

HTTP - JSON
-----------

Also working as of now although, again, the code is in need of work. When the script is run it opens the internal phantomjs webserver and listens to port 8080. To use the server go to http://localhost:8080/{isbn} in your web browser where you have replaced the isbn part with the number you want to lookup. For example go to http://localhost:8080/9780439023528 and it will return the information about the book in JSON format.

Still working with what http codes to return but at the moment if you use invalid characters in the path then a 401 error will be returned. If the ISBN is invalid or if an error occurs during the processing a 404 error will be returned. If the ISBN is valid a stringified JSON object will returned containing all the information gathered. If there was no available information for the ISBN then the object will simply contain the ISBN value itself.

###Executing

```
phantomjs arfinder-http-json.js
```

Using In Your Own Scripts
-------------------------

If you want to use the code in your own scripts then it is currently very easy to call - see the example below.

```
var arfinder = import('./core/arfinder-core);

var isbn = 1234567890; // the isbn you are looking for.

core.searchByISBN(isbn, function (result) {
    // do something with the result.

    // only call this if you want to
    // close phantomjs and stop.
    core.exit();
});
```

Adding Your Own Handlers
------------------------

If you want to add more handlers so that if no book details are found then it will check another source that, again, is fairly straight forward. Create you module in the core/handlers folder with a sensible name. Create an export a function that takes two parameters - the isbn and the callback for the results. Remember that the standardised fields that the handlers should return are shown in core/datamapping/core-datamapping.js. All fields should be there even if they are empty strings.

```
function mySearch(isbn, callback) {
    // Write what you want here.

    // When complete you should call the callback function with
    // the JSON formatted results as a parameter. If you can't
    // find the information then pass null or call the function
    // without supplying the parameter - as below.
    callback();
}

// Export your function from the module.
module.exports.mySearch = mySearch;
```

Next edit the handlers.js file in the same folder. Import your module and change the array exported at the end (see example) so that your function is added to it. Please be aware that the searches are carried out in the order of the array and once a handler returns some results the following handlers are NOT called.

```
var arBookFind = require("./arfinder-handlers.js");
var googleBooks = require("./google-handlers.js");
var mySearch = require("./mySearch-handlers.js")

module.exports = [arBookFind.arBookSearch, googleBooks.googleBookSearch, mySearch.mySearch];
```
