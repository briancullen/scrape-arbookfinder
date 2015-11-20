
// This function will check the provided ISBN
// to make sure it is valid and remove any
// hypens etc to make sure that it is just a
// 13 digit number. Returns null if any of the
// checks fail.
module.exports.normaliseISBN = function (isbn) {
    
    // Check if it is already null
    if (!isbn)
        return isbn;
    
    // TODO: Implement more checks.
    // Remove any hypens and trailing white spaces.
	isbn = isbn.replace(/-/g, "").trim();
    
    return isbn;
}

