// Merges the two object with properties in obj2
// overwriting properties in obj1.
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
    
    if (!data || !attribute)
        return "";
    
    var result = data;
    properties = attribute.split('.');
    for (var index in properties) {
      var currentAttribute = properties[index];
      
      if (typeof(result) == 'object'
          && currentAttribute in result)
      {
          result = result[currentAttribute];
      }
      else {
        result = "";
        break;
      }
    }
  
    if (typeof(result) != "string")
      result = result.toString();
  
	return result;
}

module.exports.mergeObjects = mergeObjects;
module.exports.getAttribute = getAttribute;