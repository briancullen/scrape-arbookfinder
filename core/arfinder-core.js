/* global phantom */
// Require the logging library.
var logger = require('./util/logging-util')

// Require the handlers for the different pages/APIs.
var handlers = require('./handlers/handlers.js')
var isbnutils = require('./util/isbn-util')

// Called to shutdown the phantom host.
function exit () {
  phantom.exit()
}

function doHandlers (isbn, resultCallback) {
  var index = 0
  var handlersFunction = function (result) {
    if (!result) {
      index += 1

      if (index < handlers.length) {
        handlers[index](isbn, handlersFunction)
      } else {
        result = {}
        result.isbn = isbn
        resultCallback(result)
      }
    } else {
      resultCallback(result)
      return
    }
  }
  handlers[index](isbn, handlersFunction)
}

function searchByISBN (isbn, resultsCallback) {
  // If there is nothing to consume the
  // result whats the point.
  if (!resultsCallback) {
    return
  }

  logger.debug('Starting serach for ' + isbn)
  isbn = isbnutils.normaliseISBN(isbn)
  if (isbn == null) {
    logger.debug('Invalid ISBN')
    setTimeout(resultsCallback, 0)
  } else {
    // Search the arBookSearch site and it it fails fall back
    // to the google search.
    setTimeout(function () { doHandlers(isbn, resultsCallback) }, 0)
  }
}

// Exports the functions for other modules to use.
module.exports.exit = exit
module.exports.searchByISBN = searchByISBN
