var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'w5o6yht85qtotwwz',
  password        : 'i6irqorjcxqmrm46',
  database        : 'kp1ghc7jnjnk4zn9'
});

module.exports.pool = pool;
