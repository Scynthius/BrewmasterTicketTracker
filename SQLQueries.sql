--Select Client Names and IDs for Create Ticket
SELECT Clients.ClientId, Clients.ClientName as Client FROM Clients

--Select Category Names and IDs for Create Ticket
SELECT Categories.CategoryId, Categories.Name as Category FROM Categories

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
SELECT Tickets.Title, Tickets.Description, Categories.Name AS Category, Clients.ClientID, Clients.ClientName,
DATE_FORMAT(Tickets.CloseDate, "%m/%d/%Y") AS Closed, Tickets.Resolution FROM Tickets
JOIN Categories ON Tickets.CategoryID = Categories.CategoryID
JOIN Clients ON Tickets.ClientID = Clients.ClientID
WHERE Tickets.Status = "Closed"