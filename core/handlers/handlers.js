var arBookFind = require("./arfinder-handlers.js");
var googleBooks = require("./google-handlers.js");

module.exports = [arBookFind.arBookSearch, googleBooks.googleBookSearch];