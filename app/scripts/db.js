module.exports = (function () {
    var sqlite3 = require('../../node_modules/sqlite3/lib').verbose();
    var db = new sqlite3.Database('/Users/scarlex/Projects/SLP-Analytics/app/models/data.db');

    return db;
})();

