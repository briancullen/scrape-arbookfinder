function mergeObjects (obj1, obj2) {
    
    if (!obj1 && obj2) {
        return obj2;
    }
    else if (!obj2 && obj1) {
        return obj1;
    }
    else if (!obj1 && !obj2) {
        return {};
    }
    
    // Should do some type checking here.
    
    var result = {};
    
    for (key in obj1) {
        result[key] = obj1[key];
    }
    
    for (key in obj2) {
        result[key] = obj2[key];
    }
    
    return result; 
}

/* Used to get attributes. Set up so that if an attribute
 * isn't in the data then an empty string is returned. Also
 * if the attribute is not a string then it is converted to
 * one. Guaranteed to return a string. */
function getAttribute(attribute, data) {
	var result = "";
    
    if (!data || !attribute)
        return result;
    
	if (attribute in data)
	{
		result = data[attribute];
		if (typeof result != "string")
			result = result.toString();
	}
	
	return result;
}

module.exports.mergeObjects = mergeObjects;
module.exports.getAttribute = getAttribute;