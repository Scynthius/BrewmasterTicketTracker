var express = require('express');
var mysql = require('./dbcon.js');
var path = require('path');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var Handlebars = require('handlebars');
var bodyParser = require('body-parser');
const { resolve } = require('path');

const SELECT_CLIENTS = 'SELECT Clients.ClientID, Clients.ClientName as Client FROM Clients';
const SELECT_CATEGORIES = 'SELECT Categories.CategoryID, Categories.Name as Category FROM Categories';
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


app.set('port', process.env.PORT || 8080);

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

app.post('/create', function (req, res, next) {
  var requestType = req.body.requestType;
  
  switch (requestType) {
    case "Assign Ticket":
      for (var i = 1; i < req.body.AssignedNum; i++) {
        postQuery('INSERT INTO Assignments (`EmployeeID`, `TicketID`) VALUES (?,?)',
        [req.body.Assigned[i], req.body.TicketID]);
      }
      postQuery('INSERT INTO Assignments (`EmployeeID`, `TicketID`) VALUES (?,?)',
      [req.body.Assigned[0], req.body.TicketID])
      .then(() => {
        postQuery('UPDATE Tickets SET Status="Assigned" WHERE TicketID=CAST((?) AS int)',
        [req.body.TicketID]);
        res.sendStatus(200);
      });
      break;
    case "New Business Type":
      postQuery('INSERT INTO BusinessTypes (`Name`, `CreatedDate`) VALUES (?, ?)', [req.body.name, req.body.date])
      .then(() => {
        res.sendStatus(200);
      });
      break;
    case "New Category":
      postQuery('INSERT INTO Categories (`Name`, `CreatedDate`) VALUES (?, ?)', [req.body.name, req.body.date])
      .then(() => {
        res.sendStatus(200);
      });
      break;
    case "New Employee":
      postQuery('INSERT INTO Employees (`FirstName`, `LastName`, `Email`, `AccessLevel`) VALUES (?,?,?,?)',
      [req.body.FirstName, req.body.LastName, req.body.Email, req.body.AccessLevel])
      .then(() => {
        res.sendStatus(200);
      });
      break;
    case "New Client":
      postQuery('INSERT INTO Clients (`ClientName`, `PrimaryContact`, `Email`, `Phone`) VALUES (?,?,?,?)',
      [req.body.ClientName, req.body.PrimaryContact, req.body.Email, req.body.Phone])
      .then((results) => {
        for (var i = 1; i < req.body.ClientTypeCount; i++) {
          postQuery('INSERT INTO ClientTypes (`ClientID`, `TypeID`) VALUES (?,?)',
          [results.insertId, req.body.ClientType[i]]);
        }
        return postQuery('INSERT INTO ClientTypes (`ClientID`, `TypeID`) VALUES (?,?)',
          [results.insertId, req.body.ClientType[0]]);
      })
      .then(() => {
        res.sendStatus(200);
      });
      break;
    case "New Ticket":
      postQuery('INSERT INTO Tickets (`Title`, `Description`, `ClientID`, `CategoryID`, `Status`, `SubmitDate`) VALUES (?,?,?,?,?,?)',
      [req.body.Title, req.body.Description, req.body.ClientID, req.body.CategoryID, req.body.Status, req.body.SubmitDate])
      .then(() => {
        res.sendStatus(200);
      });
      break;
  }
});

app.get('/ticket-search*', function (req, res) {
  var context = {};
  getQuery('SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, Tickets.Resolution, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.TicketID =' + mysql.pool.escape(req.query.ticketNumber) + ' GROUP BY Tickets.TicketID')
  .then((rows) => {
    context.TicketID = req.query.ticketNumber;
    context.tickets = rows;
    res.render('ticketSearch', context);
  });
});

app.get('/client-search*', function (req, res) {
  var context = {};
  getQuery('SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Clients.ClientName =' + mysql.pool.escape(req.query.clientName) + ' GROUP BY Tickets.TicketID')
  .then((rows) => {
    context.ClientName = req.query.clientName;
    context.tickets = rows;
    res.render('clientSearch', context);
  });
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

app.delete("/employee_details", function(req, res, next){
  mysql.pool.query('DELETE FROM Assignments WHERE EmployeeID=(?); DELETE FROM Employees WHERE EmployeeID=(?);',
      [req.body.EmployeeID, req.body.EmployeeID], function (err, result) {
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
    return getQuery('SELECT EmployeeID, FirstName, LastName, AccessLevel, Email FROM `Employees`');
  }).then((rows) => {
    context.employees = rows;
    res.render('allEmployees', context);
  });
})

app.get('/ticket_details/:ticketid',function(req,res){
  context = {};
  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Tickets.CategoryID, Tickets.Status, Tickets.ClientID, Clients.ClientName, Tickets.Resolution, Tickets.SubmitDate, Tickets.ModifiedDate, Tickets.CloseDate FROM Tickets JOIN Clients ON Tickets.ClientID = Clients.ClientID WHERE Tickets.TicketID = ' + req.params.ticketid + ' GROUP BY Tickets.TicketID')
  }).then((rows) => {
    context.tickets = rows;
  }).then(() => {
    return getQuery('SELECT CONCAT(Employees.FirstName, \' \', Employees.LastName) AS FullName, Employees.EmployeeID FROM Assignments INNER JOIN Employees ON Employees.EmployeeID = Assignments.EmployeeID WHERE Assignments.TicketID=' + req.params.ticketid );
  }).then((rows) => {
    context.assignedemployees = rows;
  }).then(() => {
    return getQuery('SELECT CONCAT(Employees.FirstName, \' \', Employees.LastName) AS FullName, Employees.EmployeeID FROM Employees');
  }).then((rows) => {
    context.employees = rows;
  }).then(() => {
    return getQuery('SELECT ClientID, ClientName, (CASE WHEN (ClientID=' + context.tickets[0]["ClientID"] + ') then (true) ELSE(false) End) AS Selected FROM Clients');
  }).then((rows) => {
    context.clients = rows;
  }).then(() => {
    return getQuery('SELECT CategoryID, Name, (CASE WHEN (CategoryID=' + context.tickets[0]["CategoryID"] + ') then (true) ELSE(false) End) AS Selected FROM Categories');
  }).then((rows) => {
    context.categories = rows;
    res.render('tickets', context);
  });
});

app.put("/ticket_details", function(req, res, next){
  let status = 200;
  postQuery('UPDATE Tickets SET Title=(?), Description=(?), CategoryID=CAST((?) AS int), ClientID=CAST((?) AS int), Status=(?), ModifiedDate=(?), CloseDate=(?), Resolution=(?) WHERE TicketID=CAST((?) AS int)',
      [req.body.Title, req.body.Description, req.body.CategoryID, req.body.ClientID, req.body.Status, req.body.ModifiedDate, req.body.CloseDate, req.body.Resolution, req.body.TicketID])
  .then((res) => {
    status = res;
  }).then(() => {
    return postQuery('DELETE FROM Assignments WHERE TicketID=(?)', [req.body.TicketID])
  }).then((res) => {
    status = res;
  }).then(() => {
    if (req.body.Assignments.length > 0) {
      var queryString = "INSERT INTO Assignments (EmployeeID, TicketID) VALUES ";
      for(let emp in req.body.Assignments){
        queryString = queryString.concat("(CAST(" + req.body.Assignments[emp] + " AS int), CAST(" + req.body.TicketID + " AS int)),")
      }
      queryString = queryString.slice(0, -1);
      return getQuery(queryString)
    } else {
      res.sendStatus(200);
    }
  }).then((rows) => {
    res.sendStatus(200);
  })
});

app.delete("/ticket_details", function(req, res, next){
  let status = 200;
  postQuery('DELETE FROM Assignments WHERE TicketID=(?)', [req.body.TicketID])
  .then((result) => {
    status = 200;
  }).then(() => {
    return postQuery('DELETE FROM Tickets WHERE TicketID=(?)', [req.body.TicketID])
  }).then((result) => {
    status = 200;
    res.sendStatus(status);
  })
});


app.get('/tickets',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, Clients.ClientId, Clients.ClientName, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed FROM Tickets JOIN Categories ON Tickets.CategoryID = Categories.CategoryID JOIN Clients ON Tickets.ClientID = Clients.ClientID');
  }).then((rows) => {
    context.tickets = rows;
    res.render('allTickets', context)
  })
});

app.get('/client_details/:clientid',function(req,res){
  context = {};
  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Clients.ClientID, Clients.ClientName, Clients.PrimaryContact, Clients.Email, Clients.Phone FROM Clients WHERE Clients.ClientID = ' + req.params.clientid)
  }).then((rows) => {
    context.clients = rows;
  }).then(() => {
    return getQuery('SELECT BusinessTypes.TypeID, BusinessTypes.Name FROM BusinessTypes JOIN ClientTypes on ClientTypes.TypeID = BusinessTypes.TypeID WHERE ClientTypes.ClientID=' + req.params.clientid );
  }).then((rows) => {
    context.assignedtypes = rows;
  }).then(() => {
    return getQuery('SELECT BusinessTypes.TypeID, BusinessTypes.Name FROM BusinessTypes');
  }).then((rows) => {
    context.types = rows;
    res.render('clients', context);
  });
});

app.get('/clients',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT Clients.ClientID, Clients.ClientName, Clients.PrimaryContact, Clients.Email, Clients.Phone, COUNT(Tickets.TicketID) AS ticketCount FROM Clients LEFT JOIN (SELECT * FROM Tickets WHERE Status != \'Closed\') AS Tickets ON Tickets.ClientID = Clients.ClientID GROUP BY Clients.ClientID');
  }).then((rows) => {
    context.clients = rows;
    res.render('allClients', context);
  });
});

app.get('/business-type_details/:typeid',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT TypeID, Name, CreatedDate FROM BusinessTypes WHERE TypeID= ' + req.params.typeid);
  }).then((rows) => {
    context.types = rows;
    res.render('businesses', context);
  });
});

app.put("/business-type_details", function(req, res, next){
  let status = 200;
  postQuery('UPDATE BusinessTypes SET Name=(?) WHERE TypeID=CAST((?) AS int)',
      [req.body.Name, req.body.TypeID])
  .then((result) => {
    status = 200;
    res.sendStatus(status);
  })
});

app.delete("/business-type_details", function(req, res, next){
  let status = 200;
  postQuery('DELETE FROM ClientTypes WHERE TypeID=(?)', [req.body.TypeID])
  .then((result) => {
    status = 200;
  }).then(() => {
    return postQuery('DELETE FROM BusinessTypes WHERE TypeID=(?)', [req.body.TypeID])
  }).then((result) => {
    status = 200;
    res.sendStatus(status);
  })
});



app.get('/business-types',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT TypeID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM BusinessTypes');
  }).then((rows) => {
    context.businesstypes = rows;
    res.render('allBusiness-types', context);
  });
});


app.get('/category_details/:categoryid',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT CategoryID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM Categories WHERE CategoryID=\'' + req.params.categoryid + '\'');
  }).then((rows) => {
    context.category = rows;
  }).then(() => {
    return getQuery('SELECT * FROM Tickets WHERE CategoryID='+req.params.categoryid);
  }).then((rows) => {
    if(rows.length > 0){
      context.tickets = rows;
      context.ticketsFound = true;
    } else {
      context.tickets = [];
      context.ticketsFound = false;
    }
    res.render('categories', context);
  })
});

app.put("/category_details", function(req, res, next){
  let status = 200;
  postQuery('UPDATE Categories SET Name=(?) WHERE CategoryID=CAST((?) AS int)', [req.body.Name, req.body.CategoryID])
  .then((result) => {
    status = 200;
    res.sendStatus(status);
  })
});

app.delete("/category_details", function(req, res, next){
  let status = 200;
  postQuery('DELETE FROM Categories WHERE CategoryID=CAST((?) AS int)', [req.body.CategoryID])
  .then((result) => {
    status = 200;
    res.sendStatus(status);
  })
});


app.get('/categories',function(req,res){
  context = {};

  globalQueries(context)
  .then(() => {
    return getQuery('SELECT CategoryID, Name, DATE_FORMAT(CreatedDate, "%m/%d/%Y") AS CreatedDate FROM Categories');
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

function postQuery(query, params) {
  return new Promise((resolve, reject) => {
    mysql.pool.query(query, params, function (err, rows, fields) {
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
