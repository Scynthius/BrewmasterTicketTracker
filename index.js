var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
const { resolve } = require('path');

const SELECT_CLIENTS = 'SELECT Clients.ClientId, Clients.ClientName as Client FROM Clients';
const SELECT_CATEGORIES = 'SELECT Categories.CategoryId, Categories.Name as Category FROM Categories';
const SELECT_BUSINESSTYPES = 'SELECT TypeID, Name AS BusinessType FROM BusinessTypes';
const SELECT_ASSIGNEMPLOYEES = 'SELECT EmployeeID, CONCAT(FirstName, " ", LastName) as EmployeeName FROM Employees';
const SELECT_UNASSIGNED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Tickets.Status, Tickets.ClientID, Clients.ClientName, Categories.Name as Category, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted FROM Tickets JOIN Clients as Clients ON Tickets.ClientID = Clients.ClientID JOIN Categories as Categories ON Tickets.CategoryID = Categories.CategoryID WHERE Tickets.Status = "Unassigned"';
const SELECT_ASSIGNED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, GROUP_CONCAT(CONCAT(Employees.EmployeeID, ":", Employees.FirstName, " ", Employees.LastName) SEPARATOR ",") AS AssignedEmployees, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated FROM Tickets JOIN Assignments ON Tickets.TicketID = Assignments.TicketID JOIN Employees ON Assignments.EmployeeID = Employees.EmployeeID JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.Status = "Assigned" GROUP BY Tickets.TicketID';
const SELECT_CLOSED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Clients.ClientID, Clients.ClientName, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed, Tickets.Resolution FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.Status = "Closed"'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.argv[2]);

app.get('/',function(req,res){
  var context = {};

  globalQueries(context)
  .then(() => {
    return getQuery(SELECT_ASSIGNEMPLOYEES);
  }).then((rows) => {
    context.unassigned = rows;
    return getQuery(SELECT_ASSIGNED);
  })
  .then((rows) => {
    context.assigned = rows;
    for (var i = 0; i < context.assigned.length; i++) {
      var assigned = context.assigned[i].AssignedEmployees;
      var result = assigned.split(/,|:/);
      var employees = [];
      for (var j = 0; j < result.length; j += 2) {
        employees.push({
          "id" : result[j],
          "name" : result[j+1]
        });
      }
      context.assigned[i].AssignedEmployees = employees;
    }
    return getQuery(SELECT_CLOSED);
  })
  .then((rows) => {
    context.closed = rows;
    res.render('dashboard', context);
  });
});

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

function getQuery(query) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(query, function (err, rows, fields) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    })
  })
}

function globalQueries(context) {
  return new Promise((resolve) => {
    getQuery(SELECT_CLIENTS)
    .then((rows) => { 
      context.clients = rows;
      return getQuery(SELECT_CATEGORIES);
    })
    .then((rows) => {
      context.categories = rows;
      return getQuery(SELECT_BUSINESSTYPES);
    }).then((rows) => {
      context.types = rows;
      resolve();
    });
  });
}