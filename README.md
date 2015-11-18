ARBookFinder Scraper
====================

For the accelerated reader program it is necessary to know the points and other details for the books students are reading. These can be found on arbookfind.co.uk but when trying to catalog a large number of books the fact that the website does not support an API presents a difficulty. Indeed the site requires a cookie to be set to access the search engine.

This repository holds my various efforts to overcome this limitation. The aim of the code here is to take an ISBN (either typed or scanned) and look up a books details. This is achieved by using *phantomjs* to scrape their website and return the information in a usable format. As a fallback the scripts will also try and access the Google Books API if no information is found on the arbookfind website.

Currently I'm experimenting with two different methods of both invoking the program and formatting the result. These may be joined together in one script at some point but at the moment I have kept them seperate. The methods are as follows:

 * Command Line - CSV: Access via command line with results saved to CSV file.
 * HTTP - JSON: Access via HTTP request with results returned as JSON.
 
Prerequistes
------------
* PhantonJS ( http://phantomjs.org/ ) - running with 2.0.1-development but should run with most versions.


Command Line - CSV
------------------

While the code for this approach is not pretty it does work. Once the script is invoked with *phantomjs* it will prompt you for a ISBN to lookup. The resulting information will only be summarised on the console - the book title will appear if it was found. All other information is saved into one of two files that are created in the current working directory of the script.

 * **libraryDB.csv** - this contains all the information on books that could be found.
 * **libraryUnknownDB.csv** - this contains the ISBN numbers of books for which no information could be found.
 
The script will ask for a new ISBN after each search. To end the script just enter a blank ISBN.

###Executing

```
phantonjs arfinder-cli-csv.js
```

HTTP - JSON
-----------

Still very much under development and nowhere near working as of yet. When complete it will be a simple Python 2.7 HTTP server that spawns *phantomjs* as a seperate process. The server will accept requrest in the form of http://server:port/ISBN (where ISBN is the actual ISBN number) and return a JSON response with the collected information. Invalid ISBNs, any other paths or methods other than GET will all result in 404 or similar error codes.