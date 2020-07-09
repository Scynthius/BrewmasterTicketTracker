var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_frymanj',
  password        : 'odinhammer13',
  database        : 'cs340_frymanj'
});

module.exports.pool = pool;
