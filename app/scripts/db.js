module.exports = (function () {
    var cwd = process.cwd();
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(cwd + '/models/data.db');

    return db;
})();

