var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'team',
  password : '111111',
  port     : '3307' ,
  database : 'shopping_mall'
});
db.connect();
module.exports = db;