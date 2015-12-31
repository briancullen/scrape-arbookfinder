// This function will check the provided ISBN
// to make sure it is valid and remove any
// hypens etc to make sure that it is just a
// 13 digit number. Returns null if any of the
// checks fail.
function normaliseISBN (isbn) {
  isbn = isbn.replace(/[^\dX]/gi, '').toUpperCase()
  if (isISBN10(isbn)) {
    isbn = convertToISBN13(isbn)
  } else if (!isISBN13(isbn)) {
    return null
  }

  return isbn
}

function convertToISBN13 (isbn) {
  if (isbn.length !== 10) {
    return null
  }

  isbn = '978' + isbn.slice(0, -1)
  var checkDigit = calculateISBN13CheckDigit(isbn)
  return isbn + checkDigit.toString()
}

function calculateISBN13CheckDigit (isbn) {
  if (isbn.length === 13) {
    isbn = isbn.slice(0, -1)
  }

  if (isbn.length !== 12) {
    return null
  }

  var sum = 0
  for (var index = 0; index < isbn.length; index++) {
    if (index % 2 === 1) {
      sum += 3 * parseInt(isbn[index], 10)
    } else {
      sum += parseInt(isbn[index], 10)
    }
  }

  var checkDigit = 10 - (sum % 10)
  if (checkDigit === 10) {
    checkDigit = 0
  }

  return checkDigit
}

function isISBN13 (isbn) {
  if (isbn.length !== 13) {
    return false
  }

  return (calculateISBN13CheckDigit(isbn).toString() === isbn[12])
}

function isISBN10 (isbn) {
  if (isbn.length !== 10) {
    return false
  }

  var chars = isbn.split('')
  if (chars[9].toUpperCase() === 'X') {
    chars[9] = 10
  }

  var sum = 0
  for (var i = 0; i < chars.length; i++) {
    sum += ((10 - i) * parseInt(chars[i], 10))
  }

  return ((sum % 11) === 0)
}

module.exports.normaliseISBN = normaliseISBN
