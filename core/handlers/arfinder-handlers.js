// Require the logging library.
var logger = require('../util/logging-util')
var datamapping = require('../datamapping/arfinder-datamapping')

// Require the phantomJS libraries.
var wp = require('webpage')

const arReaderURL = 'http://www.arbookfind.co.uk'

function bookDetailsHandler (page, isbn, callback) {
  return function (status) {
    if (status === 'success') {
      logger.debug('Processing results for ' + isbn)
      var result = page.evaluate(function (isbn, datamapping) {
        // Makes a new object and retrieved the information off the page for the various
        // attributes - fortunately the ARBookFind site is very well organised.
        var result = { }

        for (var index = 0; index < datamapping.columnNames.length; index++) {
          var column = datamapping.columnNames[index]
          if (column in datamapping.columnHTMLId) {
            result[column] = document.getElementById(datamapping.columnHTMLId[column]).textContent
          } else {
            result[column] = ''
          }
        }

        // Bit of a hack
        if (result['author'] !== '') {
          var nameParts = result['author'].split(',')
          result['author'] = nameParts.pop().trim() + ' '
          result['author'] += nameParts.join(' ').trim()
        }

        result.isbn = isbn
        result.ranking = document.getElementById(datamapping.rankHTMLId).firstChild.getAttribute('alt')
        result.imageURL = document.getElementById(datamapping.imageURLHTMLId).getAttribute('src')
        var table = document.getElementById(datamapping.publisherTblHTMLId)
        var rows = table.children[0].children
        for (index = 1; index < rows.length; index++) {
          if (rows[index].children[1].textContent.replace(/-/g, '').trim() === isbn) {
            result.publisher = rows[index].children[0].textContent.trim()
            result.publishedDate = rows[index].children[2].textContent.trim()
            result.pages = rows[index].children[3].textContent.trim()
          }
        }

        return result
      }, isbn, datamapping)

      callback(result)
    } else {
      logger.error('Unable to retrieve the book details (' + status + ')')
    }
  }
}

function searchResultsHandler (page, isbn, callback) {
  return function (status) {
    if (status === 'success') {
      logger.debug('Performed search for ' + isbn + '.')
      page.onLoadFinished = bookDetailsHandler(page, isbn, callback)

      // Selects the first book link on the search results page and
      // simulates a click on it to get to the detailed results.
      if (!page.evaluate(function () {
        var dom = document.querySelectorAll('[class=link_bold]')
        if (dom.length === 1) {
          dom[0].click()
          return true
        }

        return false
      })) {
        logger.debug('Book details not available on AR Book Finder.')
        callback()
      }
    } else {
      logger.error('Unable to get the search results (' + status + ')')
      callback()
    }
  }
}

function arBookSearch (isbn, callback) {
  initSearch(function (page) {
    if (!page) {
      setTimeout(callback, 0)
      return
    }

    page.onLoadFinished = searchResultsHandler(page, isbn, callback)

    page.evaluate(function (bookISBN) {
      // Simulate entering the ISBN into the search box and clicking the button.
      document.getElementById('ctl00_ContentPlaceHolder1_txtKeyWords').value = bookISBN
      document.getElementById('ctl00_ContentPlaceHolder1_btnDoIt').click()
    }, isbn)
  })
}

function initSearch (callback) {
  // Open the main page and simulate clicking on the
  // teacher option to set the cookie and get to the
  // main search page.
  var page = wp.create()

  // Make sure the page is closed no matter what.
  var resultsCallback = function (results) {
    page.close()
    callback(results)
  }

  page.open(arReaderURL, function (status) {
    if (status === 'success') {
      logger.debug('Connected to ' + page.url)

      if (page.url === arReaderURL + '/UserType.aspx') {
        // This is called once the submit button is pressed below.
        page.onLoadFinished = function (status) {
          if (status !== 'success') {
            logger.error('Unable to log in as teacher (' + status + ')')
            callback()
          }

          logger.debug('Logged in as a teacher to ' + page.url)
          callback(page)
        }

        // Simulates clicking on the teacher option and pressing submit.
        page.evaluate(function () {
          document.getElementById('radTeacher').checked = true
          document.getElementById('btnSubmitUserType').click()
        })
      } else if (page.url === arReaderURL + '' ||
        page.url === arReaderURL + '/default.aspx') {
        callback(page)
      } else {
        logger.warn('On unknown URL (' + page.url + ')')
        callback()
      }
    } else {
      logger.error('Unable to connect to ' + arReaderURL + ' (' + status + ')')
    }
  })
}

// Exports the functions for other modules.
module.exports.arBookSearch = arBookSearch
