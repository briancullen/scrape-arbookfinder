var coredata = require('../datamapping/core-datamapping.js');

/* This function takes either a JSON string or object and converts it into
 * a CSV string that is the returned to the caller. */
function json2csv(JSONData) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = JSONData;
    if (!arrData) {
      arrData = {};
    }
    else if (typeof JSONData != 'object') {
      arrData = JSON.parse(JSONData);
    }
    
    var CSV = "";    
	var row = "";

    for (var index in coredata.columnNames) {
		value = "";
		if (coredata.columnNames[index] in arrData)
            // Convert the value to a string if necessary.
            value = arrData[coredata.columnNames[index]]
            if (typeof(value) != 'string')
              value = JSON.stringify(value);
			value = value.replace(/\"/g, '""');
		
		row += '"' + value + '",';
    }
     
    //add a line break after each row
    CSV += row.slice(0, -1) + '\r\n';
	return CSV;
}

function setupCSV(csvFile) {
    var row = "";
	for (var index in coredata.columnNames) {
		row +='"' + coredata.columnNames[index].replace(/\"/g, "\"\"") + '",';
	}
	row = row.slice(0, -1) + '\r\n';
	csvFile.write(row);
}

module.exports.json2csv = json2csv;
module.exports.setupCSV = setupCSV;