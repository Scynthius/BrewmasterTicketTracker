--Select Client Names and IDs for Create Ticket
SELECT ClientId, ClientName as Client FROM Clients

--Select Category Names and IDs for Create Ticket
SELECT CategoryId, Name as Category FROM Categories

--Select Employee Names and IDs for Assign Ticket
SELECT EmployeeID, CONCAT(FirstName, " ", LastName) as EmployeeName FROM Employees

--Select Business Types for Create Client
SELECT TypeID, Name AS BusinessType FROM BusinessTypes

--Select Unassigned Tickets for Dashboard
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Tickets.Status,
Tickets.ClientID, Clients.ClientName, Categories.Name as Category,
DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted FROM Tickets
JOIN Clients as Clients ON Tickets.ClientID = Clients.ClientID
JOIN Categories as Categories ON Tickets.CategoryID = Categories.CategoryID
WHERE Tickets.Status = "Unassigned"

--Select Assigned Tickets for Dashboard
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status,
Clients.ClientId, Clients.ClientName,
GROUP_CONCAT(CONCAT(Employees.EmployeeID, ":", Employees.FirstName, " ", Employees.LastName) SEPARATOR ",") AS AssignedEmployees,
DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated
FROM Tickets
JOIN Assignments ON Tickets.TicketID = Assignments.TicketID
JOIN Employees ON Assignments.EmployeeID = Employees.EmployeeID
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID
WHERE Tickets.Status = "Assigned"
GROUP BY Tickets.TicketID

--Select Closed Tickets for Dashboard
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name AS Category, Clients.ClientID, Clients.ClientName,
DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed, Tickets.Resolution FROM Tickets
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID

--Select Search by Ticket Number
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status,
Clients.ClientId, Clients.ClientName, Tickets.Resolution
FROM Tickets
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID
WHERE Tickets.Status = "req.query.TicketID"
GROUP BY Tickets.TicketID

-- Select Ticket Search by Client Name
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status,
Clients.ClientId, Clients.ClientName
FROM Tickets
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID
WHERE Clients.ClientName = "req.query.ClientName"
GROUP BY Tickets.TicketID

--Select Client Search by Client Name
SELECT Clients.ClientID, Clients.ClientName, Clients.PrimaryContact, Clients.Email, Clients.Phone, 
GROUP_CONCAT(BusinessTypes.Name SEPARATOR ", ") AS BusinessType
FROM ClientTypes
JOIN Clients ON ClientTypes.ClientID = Clients.ClientID
JOIN BusinessTypes ON ClientTypes.TypeID = BusinessTypes.TypeID
WHERE Clients.ClientName = "req.query.ClientName"
GROUP BY Clients.ClientID

--Select All Tickets
SELECT Tickets.TicketID, Tickets.Title, Tickets.Description, Categories.Name as Category, Tickets.Status, 
Clients.ClientId, Clients.ClientName, DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted,
DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS LastUpdated, DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed
FROM Tickets 
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID 
JOIN Clients ON Tickets.ClientID = Clients.ClientID
LIMIT 10 OFFSET (req.query.page * 10)

--Select All Clients
SELECT Clients.ClientID, Clients.ClientName
FROM Clients
LIMIT 10 OFFSET (req.query.page * 10)

--Select All Employees
SELECT Employees.EmployeeID, CONCAT(FirstName, " ", LastName) as EmployeeName
FROM Employees
LIMIT 10 OFFSET (req.query.page * 10)

--Insert New Category
INSERT INTO Categories (`Name`, `CreatedDate`) VALUES (req.body.name, req.body.date)

--Insert New Client
INSERT INTO Clients (`ClientName`, `PrimaryContact`, `Email`, `Phone`) VALUES (req.body.ClientName,req.body.PrimaryContact,req.body.Email,req.body.Phone)

--Insert New Ticket
INSERT INTO Tickets (`Title`, `Description`, `ClientID`, `CategoryID`, `Status`, `SubmitDate`) VALUES (req.body.Title,req.body.Description,req.body.ClientID,req.body.CategoryID,req.body.Status,req.body.SubmitDate)

--Insert New Employee
INSERT INTO Employees (`FirstName`, `LastName`, `Email`, `AccessLevel`) VALUES (req.body.FirstName,req.body.LastName,req.body.Email,req.body.AccessLevel)

--Insert New BusinessType
INSERT INTO BusinessTypes (`Name`, `CreatedDate`) VALUES (req.body.Name,req.body.CreatedDate)

--Assign Ticket/Insert New Assignment
INSERT INTO Assignments (`EmployeeID`, `TicketID`) VALUES (req.body.EmployeeID,req.body.TicketID)

--Assign Business to Clients/Insert New ClientType
INSERT INTO ClientTypes (`ClientID`, `TypeID`) VALUES (req.body.ClientID,req.body.TypeID)

--Select Specified Ticket for ticket_details page
SELECT Tickets.Title, Tickets.Description, Clients.ClientName as Client, Categories.Name AS Category, Tickets.Status, 
DATE_FORMAT(Tickets.SubmitDate, "%m/%d/%Y") AS Submitted, DATE_FORMAT(Tickets.ModifiedDate, "%m/%d/%Y") AS Modified,
DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed, Tickets.Resolution  FROM Tickets
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID
WHERE Tickets.TicketID = req.body.id

--Select assigned employees for ticket_details page
SELECT CONCAT(FirstName, ' ', LastName) AS Name
FROM Assignments JOIN Employees ON Assignments.EmployeeID = Employees.EmployeeID
WHERE Assignments.TicketID = req.body.id

--Select clients, categories, employees for ticket_details page
SELECT Clients.ClientID, Clients.ClientName as Client FROM Clients
SELECT Categories.CategoryID, Categories.Name as Category FROM Categories
SELECT Employees.EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees

--Update Tickets table
UPDATE Tickets SET Title=req.body.title, Description=req.body.description, ClientID=(SELECT ClientID FROM Clients WHERE ClientName=req.body.client), 
CategoryID=(SELECT CategoryID FROM Categories WHERE Name=req.body.category),
ModifiedDate=req.body.modifiedDate,  
Status=req.body.status, SubmitDate=req.body.submitdate, 
CloseDate=(CASE WHEN (req.body.status <=> "Closed") then (req.body.closeDate) ELSE(null) End), Resolution=req.body.resolution
WHERE TicketID=req.body.ticketid
 
--Update Assignment table
DELETE FROM Assignments WHERE TicketID=req.body.ticketid;
INSERT INTO Assignments (EmployeeID, TicketID) VALUES ((SELECT EmployeeID FROM Employees WHERE CONCAT(FirstName, ' ', LastName)=req.body.employee), req.body.ticketid);

--Delete Tickets table entry. Requires Assignments to be removed first.
DELETE FROM Assignments WHERE TicketID=req.body.ticketid;
DELETE FROM Tickets WHERE TicketID=req.body.ticketid;

--Select Specified Client for client_details page
SELECT Clients.ClientName, Clients.ClientName, Clients.PrimaryContact, Clients.Email, Clients.Phone  FROM Clients
WHERE Clients.ClientID = req.body.id

--Select assigned business types for client_details page
SELECT BusinessTypes.Name AS Types FROM ClientTypes 
JOIN BusinessTypes ON BusinessTypes.TypeID = ClientTypes.TypeID
WHERE ClientTypes.ClientID = req.body.id

-- Select all business types for client_details page
SELECT BusinessTypes.Name as Types FROM BusinessTypes

--Update Client entries
UPDATE Clients SET ClientName=req.body.clientname, PrimaryContact=req.body.primarycontact, Email=req.body.email, Phone=req.body.phone
WHERE ClientID = req.body.clientid

--Update ClientTypes entry
DELETE FROM ClientTypes WHERE ClientID=req.body.clientid;
INSERT INTO ClientTypes (ClientID, TypeID) VALUES (req.body.clientid, (SELECT TypeID FROM BusinessTypes WHERE Name=req.body.clienttype));

--Delete Clients table entry. Requires ClientType to be removed first.
DELETE FROM ClientTypes WHERE ClientID=req.body.clientid;
DELETE FROM Clients WHERE CliendID=req.body.clientid;

--Select specified Employee for employee_details page
SELECT FirstName, LastName, Email, AccessLevel FROM Employees WHERE EmployeeID = req.body.id

--Select specified business type for business_details page
SELECT Name FROM BusinessTypes WHERE TypeID = req.body.id

--Select specified category for category_details page
SELECT Name FROM Categories WHERE CategoryID = req.body.id

--Update Employee
UPDATE Employees SET FirstName=req.body.firstname, LastName=req.body.lastname, Email=req.body.email, AccessLevel=req.body.accesslevel
WHERE EmployeeID=req.body.employeeid

--Delete Employees table entry. Requires Assignments to be removed first.
DELETE FROM Assignments WHERE EmployeeID=req.body.employeeid;
DELETE FROM Employees WHERE EmployeeID=req.body.employeeid;
