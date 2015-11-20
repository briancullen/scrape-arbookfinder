var loglevel = require ("./3rdparty/loglevel.min.js").getLogger("ArFinder");

// Need to provide better way to set this.
loglevel.setLevel("trace");

function createTimeStamp () {
    var currentdate = new Date(); 
    var datetime = "[" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "] ";
    
    return datetime;
}

function logTrace (message) {
    loglevel.trace("TRACE: " + createTimeStamp() + message);
}

function logDebug (message) {
    loglevel.debug("DEBUG: " + createTimeStamp() + message);
}

function logInfo (message) {
    loglevel.info("INFO: " + createTimeStamp() + message);
}

function logWarn (message) {
    loglevel.warn("WARN: " + createTimeStamp() + message);
}

function logError (message) {
    loglevel.error("ERROR: " + createTimeStamp() + message);
}


// Export the different logging functions.
module.exports.trace = logTrace;
module.exports.debug = logDebug;
module.exports.info = logInfo;
module.exports.warn = logWarn;
module.exports.error = logError;
module.exports.setLevel = loglevel.setLevel;