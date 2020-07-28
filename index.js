var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var Handlebars = require('handlebars');
var bodyParser = require('body-parser');
const { resolve } = require('path');

const SELECT_CLIENTS = 'SELECT Clients.ClientId, Clients.ClientName as Client FROM Clients';
const SELECT_CATEGORIES = 'SELECT Categories.CategoryId, Categories.Name as Category FROM Categories';
const SELECT_BUSINESSTYPES = 'SELECT TypeID, Name AS BusinessType FROM BusinessTypes';
const SELECT_ASSIGNEMPLOYEES = 'SELECT EmployeeID, CONCAT(FirstName, " ", LastName) as EmployeeName FROM Employees';
const SELECT_UNASSIGNED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Tickets.Status, Tickets.ClientID, Clients.ClientName, Categories.CategoryID, Categories.Name as Category, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted FROM Tickets JOIN Clients as Clients ON Tickets.ClientID = Clients.ClientID JOIN Categories as Categories ON Tickets.CategoryID = Categories.CategoryID WHERE Tickets.Status = "Unassigned"';
const SELECT_ASSIGNED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.CategoryID,Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, GROUP_CONCAT(CONCAT(Employees.EmployeeID, ":", Employees.FirstName, " ", Employees.LastName) SEPARATOR ",") AS AssignedEmployees, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated FROM Tickets JOIN Assignments ON Tickets.TicketID = Assignments.TicketID JOIN Employees ON Assignments.EmployeeID = Employees.EmployeeID JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.Status = "Assigned" GROUP BY Tickets.TicketID';
const SELECT_CLOSED = 'SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.CategoryID,  Categories.Name as Category, Clients.ClientID, Clients.ClientName, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed, Tickets.Resolution FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.Status = "Closed"'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
Handlebars.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
});


app.set('port', process.argv[2]);

app.get('/',function(req,res){
  var context = {};

  globalQueries(context)
  .then(() => {
    return getQuery(SELECT_ASSIGNEMPLOYEES);
  })
  .then((rows) => {
    context.employees = rows;
    return getQuery(SELECT_UNASSIGNED);
  })
  .then((rows) => {
    console.log(rows);
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

app.get('/navigation',function(req,res){
  res.render('navigation');
});

app.get('/login',function(req,res){
  res.render('login', {layout:'login.handlebars'});
});

app.get('/employee_details/:employeeid',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT EmployeeID, FirstName, LastName, Email, AccessLevel FROM Employees WHERE EmployeeID=\'' + req.params.employeeid + '\'');
  }).then((rows) => {
    if(!rows.length){
      context.failMessage = "We had trouble locating that employee. Check their employee ID number and try again.";
    } else {
      context.failMessage = null;
    }
      context.employee = rows;
      res.render('employees', context);
  });
});

app.put("/employee_details", function(req, res, next){
  mysql.pool.query('UPDATE Employees SET FirstName=(?), LastName=(?), Email=(?), AccessLevel=CAST((?) AS int) WHERE EmployeeID=CAST((?) AS int)',
      [req.body.FirstName, req.body.LastName, req.body.Email, req.body.AccessLevel, req.body.EmployeeID], function (err, result) {
        if (err) {
          next(err);
          return;
        }
        res.sendStatus(200);
  });
});

app.get('/employees', function(req, res) {
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT EmployeeID, FirstName, LastName, AccessLevel, Email FROM `Employees` LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.employees = rows;
    res.render('allEmployees', context);
  });
})

app.get('/ticket_details/:ticketid',function(req,res){
  res.render('tickets');
});

app.get('/tickets',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.tickets = rows;
    res.render('allTickets', context);
  });
});

app.get('/client_details/:clientid',function(req,res){
  res.render('clients');
});

app.get('/clients',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Clients.ClientID, Clients.ClientName, Clients.PrimaryContact, Clients.Email, Clients.Phone, COUNT(Tickets.TicketID) AS ticketCount FROM Clients LEFT JOIN (SELECT * FROM Tickets WHERE Status != \'Closed\') AS Tickets ON Tickets.ClientID = Clients.ClientID GROUP BY Clients.ClientID LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.clients = rows;
    res.render('allClients', context);
  });
});

app.get('/business-type_details/:typeid',function(req,res){
  res.render('business-types');
});

app.get('/business-types',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT TypeID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM BusinessTypes LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.businesstypes = rows;
    res.render('allBusiness-types', context);
  });
});

app.get('/category_details/:categoryid',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT CategoryID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM Categories WHERE CategoryID=\'' + req.params.categoryid + '\' LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.category = rows;
    res.render('categories', context);
  });
});

app.get('/categories',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT CategoryID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM Categories LIMIT 10 OFFSET 0');
  }).then((rows) => {
    context.categories = rows;
    res.render('allCategories', context);
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
      context.globalClients = rows;
      return getQuery(SELECT_CATEGORIES);
    })
    .then((rows) => {
      context.globalCategories = rows;
      return getQuery(SELECT_BUSINESSTYPES);
    }).then((rows) => {
      context.globalTypes = rows;
      resolve();
    });
  });
}