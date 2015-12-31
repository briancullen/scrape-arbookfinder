var core = require('../core/arfinder-core')
var webserver = require('webserver')

var server = webserver.create()
console.log('Server created.')
server.listen(8080, function (request, response) {
  var isbn = request.url.slice(1)
  if (request.method !== 'GET' ||
    !isbn.match(/[\dX-]/i)) {
    response.statusCode = 401
    response.close()
    return
  }

  core.searchByISBN(isbn, function (result) {
    if (result) {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/json')
      response.write(JSON.stringify(result))
      response.close()
    } else {
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/html')
      response.write('<h1>Resource Not Found</h1>')
      response.close()
    }
  })
})
