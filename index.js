var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
const { resolve } = require('path');

const SELECT_CLIENTS = 'SELECT Clients.ClientId, Clients.ClientName as Client FROM Clients';
const SELECT_CATEGORIES = 'SELECT Categories.CategoryId, Categories.Name as Category FROM Categories';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.argv[2]);


app.get('/',function(req,res){
  var context = {};
  var sqlPool = mysql.pool;

  getQuery(sqlPool, SELECT_CLIENTS)
  .then((rows) => { 
    context.clients = rows;
    return getQuery(sqlPool, SELECT_CATEGORIES);
  })
  .then((rows) => {
    context.categories = rows;
    console.log(context);
    res.render('dashboard', context);
  });
});

function getQuery(pool, query) {
  return new Promise((resolve, reject) => {
    pool.query(query, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    })
  })
  
}

app.post('/', function (req, res, next) {
  var requestType = req.body.requestType;
  var sqlPool = mysql.pool;
  switch (requestType) {
    case "New Category":
      sqlPool.query('INSERT INTO Categories (`Name`, `CreatedDate`) VALUES (?, ?)',
      [req.body.name, req.body.date], function (err, result) {
        if (err) {
          next(err);
          return;
        }
        res.sendStatus(200);
      });
      break;
    case "New Client":
      sqlPool.query('INSERT INTO Clients (`ClientName`, `PrimaryContact`, `Email`, `Phone`) VALUES (?,?,?,?)',
      [req.body.ClientName, req.body.PrimaryContact, req.body.Email, req.body.Phone], function (err, result) {
        if (err) {
          next(err);
          return;
        }
        res.sendStatus(200);
      });
      break;
    case "New Ticket":
      sqlPool.query('INSERT INTO Tickets (`Title`, `Description`, `ClientID`, `CategoryID`, `Status`, `SubmitDate`) VALUES (?,?,?,?,?,?)',
      [req.body.Title, req.body.Description, req.body.ClientID, req.body.CategoryID, req.body.Status, req.body.SubmitDate], function (err, result) {
        if (err) {
          next(err);
          return;
        }
        res.sendStatus(200);
      });
      break;
  }
});

app.get('/login',function(req,res){
  res.render('login', {layout:'login.handlebars'});
});

app.get('/employee_details',function(req,res){
  res.render('employees');
});

app.get('/ticket_details',function(req,res){
  res.render('tickets');
});

app.get('/client_details',function(req,res){
  res.render('clients');
});

app.get('/businesses',function(req,res){
  var context = {};
  var tableResults = [];
  var queryString = "SELECT * FROM ShipSpecs WHERE Model = 'Sidewinder'";
  mysql.pool.query(queryString, function(err, rows, fields){
    for (var entry in rows){
      tableResults.push({'Spec': rows[entry]["Spec"], 'Value': rows[entry]["Value"]});
    }
    context.specTableResult = tableResults;
    res.render('sidewinder', context);
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
