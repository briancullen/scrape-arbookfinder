var fs = require('fs');
var wp = require('webpage');
var arReaderURL = 'http://www.arbookfind.co.uk';
var googleURL = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';

var newFile = (!fs.exists("libraryDB.csv"));
var bookDB = fs.open('libraryDB.csv', 'a');
var unknownBookDB = fs.open('libraryUnknowDB.csv', 'a');

var isbn = "";

var columns = ["isbn", "title", "author", "publisher", "publishedDate", "quizNumber", "lang", "summary", "level",
		"interest", "points", "ranking", "words", "pages", "category", "topic", "series"];

if (newFile)
{
	var row = "";
	for (var index in columns) {
		row +='"' + columns[index].replace(/\"/g, "\"\"") + '",';
	}
	row = row.slice(0, -1) + '\r\n';
	bookDB.write(row);
	newFile = false;
}


function getAtrribute(attribute, data) {
	var result = "";
	if (attribute in data)
	{
		result = data[attribute];
		if (typeof result != "string")
			result = result.toString();
	}
	
	return result;
}

function json2csv(JSONData) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = "";    
	var row = "";

    for (var index in columns) {
		value = "";
		if (columns[index] in arrData)
			value = arrData[columns[index]].replace(/\"/g, '""');
		
		row += '"' + value + '",';
    }
     
    //add a line break after each row
    CSV += row.slice(0, -1) + '\r\n';
	return CSV;
}


function searchGoogle() {
	var google = wp.create();
	google.open(googleURL + isbn, function(status) {
		if (status == "success")
		{
			data = JSON.parse(google.plainText);

			if (data["totalItems"] == 1) {
				var result = new Object();
				var book = data["items"][0]["volumeInfo"];
				result.isbn = isbn;
				result.title = getAtrribute("title", book) + " " + getAtrribute("subtitle", book);
				result.author = getAtrribute("authors", book);
				result.publisher = getAtrribute("publisher", book);
				result.publishedDate = getAtrribute("publishedDate", book);
				result.quizNumber = "";
				result.lang = getAtrribute("language", book).toUpperCase();
				result.summary = getAtrribute("description", book);
				result.level = "";
				result.interest = "";
				result.points = "";
				result.ranking = "";
				result.words = "";
				result.pages = getAtrribute("pageCount", book);
				result.category = "";
				result.topic = getAtrribute("categories", book);
				result.series = "";
				
				console.log(result.title);				
				bookDB.write(json2csv(result));
			}
			else {
				console.log("Book details not available on Google.");
				unknownBookDB.write(isbn + "\r\n");
			}
		}
		
		google.close();	
		page.onLoadFinished = function() {};
		page.open(arReaderURL, bookSearch);
	}); 
}

function bookSearch() {
	page.onLoadFinished = function () {
		page.onLoadFinished = function() {
			var result = page.evaluate(function(isbn) {
				var result = new Object();
				result.isbn = isbn;
				result.title = document.getElementById('ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle').textContent;
				result.author = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblAuthor").textContent;
				result.quizNumber = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblQuizNumber").textContent;
				result.lang = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblLanguageCode").textContent;
				result.summary = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblBookSummary").textContent;
				result.level = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblBookLevel").textContent;
				result.interest = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblInterestLevel").textContent;
				result.points = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblPoints").textContent;
				result.ranking = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblRanking").firstChild.getAttribute("alt");
				result.words = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount").textContent;
				result.pages = "";
				result.category = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblFictionNonFiction").textContent;
				result.topic = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblTopicLabel").textContent;
				result.series = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblSeriesLabel").textContent;
				result.publisher = "";
				result.publishedDate = "";
				
				var table = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_tblPublisherTable")
				var rows = table.children[0].children
				for (var index = 1; index < rows.length; index++) { 
					if (rows[index].children[1].textContent.replace(/-/g, "").trim() == isbn)
					{
						result.publisher = rows[index].children[0].textContent.trim();
						result.publishedDate = rows[index].children[2].textContent.trim();
						result.pages = rows[index].children[3].textContent.trim();
					}
				}
				
				return result;
			}, isbn);
			
			console.log(result.title);
			bookDB.write(json2csv(result));
			
			page.onLoadFinished = function() {};
			page.open(arReaderURL, bookSearch);
		};
		
		if (!page.evaluate(function() {
				var dom = document.querySelectorAll("[class=link_bold]");
				if (dom.length == 1)
				{
					dom[0].click();
					return true;
				}
				
				return false;
			}))
		{
			console.log("Book details not available on AR Book Finder.");	
			searchGoogle();

		}
	};
	
	var system = require('system');
	system.stdout.write('ISBN: ');
	isbn = system.stdin.readLine().replace(/-/g, "").trim();
	
	if (isbn == "")
	{
		bookDB.close();
		unknownBookDB.close();
		page.close();
		phantom.exit();
	}
		
	page.evaluate(function(book) {
		document.getElementById('ctl00_ContentPlaceHolder1_txtKeyWords').value = book;
		document.getElementById('ctl00_ContentPlaceHolder1_btnDoIt').click();
	}, isbn);
}

var page = wp.create();
page.open(arReaderURL, function(status) {
	console.log("Status: " + status);
	if (status == "success")
	{
		page.onLoadFinished = bookSearch;
		page.evaluate(function(){
			document.getElementById('radTeacher').checked = true;
			document.getElementById('btnSubmitUserType').click();
		});		
	}
	
});

// document.getElementById('radTeacher').checked = true;
// document.getElementById('btnSubmitUserType').click()
// document.getElementById('ctl00_ContentPlaceHolder1_txtKeyWords').value = "0-7475-3269-9"
// document.getElementById('ctl00_ContentPlaceHolder1_btnDoIt').click()
// document.querySelectorAll("[class=link_bold]")[0].getAttribute("href")
// document.getElementById('ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle').textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblAuthor).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblQuizNumber).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblLanguageCode).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblBookSummary).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblBookLevel).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblInterestLevel).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblPoints).textContent
// document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_lblRanking").firstChild.getAttribute("alt")
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblFictionNonFiction).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblTopicLabel).textContent
// document.getElementById(ctl00_ContentPlaceHolder1_ucBookDetail_lblSeriesLabel).textContent

// var table = document.getElementById("ctl00_ContentPlaceHolder1_ucBookDetail_tblPublisherTable")
// var rows = table.children[0].children
// rows[1].children[1].textContent.replace(/-/g, "")
// for (var index = 1; index < rows.length; index++) { console.log(rows[index].children[1].textContent.replace(/-/g, "")); }

