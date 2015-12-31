/* global describe it */
var test = require('unit.js')
var csvutil = require('../core/util/csv-util')
var writer = require('./test-util/fake-write-stream.js')

var obj1 = {
  isbn: '123456789',
  title: 'title',
  words: 555
}

describe('Testing CSV Util', function () {
  describe('JSON to CSV', function () {
    it('should convert object to CSV', function () {
      test.string(csvutil.json2csv(obj1)).is('"123456789","title","","","","","","","","","","","555","","","","",""' + '\r\n')
    })

    it('should convert JSON string to CSV', function () {
      test.string(csvutil.json2csv(JSON.stringify(obj1))).is('"123456789","title","","","","","","","","","","","555","","","","",""' + '\r\n')
    })

    it('should handle null gracefully', function () {
      test.string(csvutil.json2csv(null)).is('"","","","","","","","","","","","","","","","","",""' + '\r\n')
    })
  })

  it('should setup CSV Files correctly', function () {
    csvutil.setupCSV(writer)
    test.string(writer.buffer).is('"isbn","title","author","publisher","publishedDate","quizNumber","lang","summary","level",' +
		'"interest","points","ranking","words","pages","category","topic","series","imageURL"' + '\r\n')
  })
})
