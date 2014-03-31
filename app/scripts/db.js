module.exports = (function () {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('/Users/scarlex/Projects/SLP-Analytics/app/models/data.db');

    return db;
})();

