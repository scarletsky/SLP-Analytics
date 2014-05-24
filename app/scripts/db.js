module.exports = (function () {
    var cwd = process.cwd();
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(cwd + '/models/data.db');

    // var sqlite3 = require('sqlite3').verbose();
    // var execPath = process.execPath;
    // var path = execPath.substring(0, execPath.length - 6);
    // var db = new sqlite3.Database(path + 'data.db');

    return db;
})();

