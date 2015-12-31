/* global describe it */
var test = require('unit.js')
var isbnutil = require('../core/util/isbn-util')

var testdata = [
  {
    isbn10: '1781100489',
    isbn10Hypen: '1-781-100-489',
    isbn13: '9781781100486',
    isbn13Hypen: '9-781-781-100-486'
  },
  {
    isbn10: '1407109367',
    isbn10Hypen: '1-4071-0936-7',
    isbn13: '9781407109367',
    isbn13Hypen: '978-1-4071-0936-7'
  },
  {
    isbn10: '1858810701',
    isbn10Hypen: '1-85881-070-1',
    isbn13: '9781858810706',
    isbn13Hypen: '978-1-85881-070-6'
  }
]

describe('Testing ISBN Codes', function () {
  it('should return null for invalid ISBN10 Codes', function () {
    test.value(isbnutil.normaliseISBN('asdfasd')).isNull()
  })

  it('should return null for invalid ISBN10 Codes', function () {
    test.value(isbnutil.normaliseISBN('1234567890')).isNull()
  })

  it('should return null for invalid ISBN13 Codes', function () {
    test.value(isbnutil.normaliseISBN('asdfasdasdqwe')).isNull()
  })

  it('should return null for invalid ISBN13 Codes', function () {
    test.value(isbnutil.normaliseISBN('1234567890123')).isNull()
  })

  testdata.forEach(function (data) {
    it('should return ISBN13 code for ISBN10 Codes', function () {
      test.string(isbnutil.normaliseISBN(data.isbn10)).is(data.isbn13)
    })

    it('should return ISBN13 code for ISBN10 Codes With Hypens', function () {
      test.string(isbnutil.normaliseISBN(data.isbn10Hypen)).is(data.isbn13)
    })

    it('should return the same ISBN13 codes when valid', function () {
      test.string(isbnutil.normaliseISBN(data.isbn13)).is(data.isbn13)
    })

    it('should return a valid ISBN13 codes with hypens with the hypens removed', function () {
      test.string(isbnutil.normaliseISBN(data.isbn13Hypen)).is(data.isbn13)
    })
  })
})
