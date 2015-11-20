var core = require('./core-datamapping');

const columnProperty = { };
columnProperty[core.columnNames[2]] = 'authors';
columnProperty[core.columnNames[3]] = 'publisher';
columnProperty[core.columnNames[4]] = 'publishedDate';
columnProperty[core.columnNames[6]] = 'language';
columnProperty[core.columnNames[7]] = 'description';
columnProperty[core.columnNames[13]] = 'pageCount';
columnProperty[core.columnNames[15]] = 'categories';

module.exports.columnNames = core.columnNames;
module.exports.columnProperty = columnProperty;
