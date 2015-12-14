var core = require('./core-datamapping');

const baseHTMLId = "ctl00_ContentPlaceHolder1_ucBookDetail_";

const dataHTMLId = { };
dataHTMLId[core.columnNames[1]] = baseHTMLId+"lblBookTitle";
dataHTMLId[core.columnNames[2]] = baseHTMLId+"lblAuthor";
dataHTMLId[core.columnNames[5]] = baseHTMLId+"lblQuizNumber";
dataHTMLId[core.columnNames[6]] = baseHTMLId+"lblLanguageCode";
dataHTMLId[core.columnNames[7]] = baseHTMLId+"lblBookSummary";
dataHTMLId[core.columnNames[8]] = baseHTMLId+"lblBookLevel";
dataHTMLId[core.columnNames[9]] = baseHTMLId+"lblInterestLevel";
dataHTMLId[core.columnNames[10]] = baseHTMLId+"lblPoints";
dataHTMLId[core.columnNames[12]] = baseHTMLId+"lblWordCount";
dataHTMLId[core.columnNames[14]] = baseHTMLId+"lblFictionNonFiction";
dataHTMLId[core.columnNames[15]] = baseHTMLId+"lblTopicLabel";
dataHTMLId[core.columnNames[16]] = baseHTMLId+"lblSeriesLabel";

const dataRankingHTMLId = baseHTMLId+"lblRanking";
const dataPublisherTblHTMLId = baseHTMLId+"tblPublisherTable";
const imageURLHTMLId = baseHTMLId+"imgBookCover"

module.exports.columnNames = core.columnNames;
module.exports.columnHTMLId = dataHTMLId;
module.exports.rankHTMLId = dataRankingHTMLId;
module.exports.publisherTblHTMLId = dataPublisherTblHTMLId;
module.exports.imageURLHTMLId = imageURLHTMLId;
