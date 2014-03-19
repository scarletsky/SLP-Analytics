var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/scarlex/Projects/SLP-Analytics/app/db/data.db');

db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  console.log(row.id + ": " + row.info);
});

db.close();
