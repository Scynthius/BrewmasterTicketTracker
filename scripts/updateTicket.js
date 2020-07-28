(function () {
    function updateTicket() {
        var ticketID = document.getElementById("updateTicketID").value;
        var ticketTitle = document.getElementById("updateTitle").value;
        var ticketDesc = document.getElementById("updateDescription").value;
        var ticketCat = document.getElementById("updateCategory").value;
        var ticketClient = document.getElementById("updateClientList").value;
        var ticketStatus = document.getElementById("updateStatus").value;
        var ticketRes = document.getElementById("updateResolution").value;
        var assignments = document.getElementById("assignedEmployeesTable").rows;
        var modDate = getCurrentDate();
        var closeDate = null;
        if (document.getElementById("updateTicketOldStatus").value !== "Closed" && ticketStatus === "Closed"){
            closeDate = getCurrentDate();
        }
        var data = {
            "TicketID"          : ticketID,
            "Title"             : ticketTitle,
            "Description"       : ticketDesc,
            "CategoryID"        : ticketCat,
            "ClientID"          : ticketClient,
            "Status"            : ticketStatus,
            "Resolution"        : ticketRes,
            "Assignments"       : assignments,
            "ModifiedDate"      : modDate,
            "CloseDate"         : closeDate
        };
        var request = new XMLHttpRequest();
        request.open('PUT', '/ticket_details', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#confirm-update').modal('show');
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    };
    function deleteTicket(){
        var ticketID = document.getElementById("updateTicketID").value;
        var data = {
            "TicketID"        : ticketID
        };
        var request = new XMLHttpRequest();
        request.open('DELETE', '/ticket_details', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#completed-delete').modal('show');
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    }
    try {
        var updateTicketButton = document.getElementById('updateTicket');
        updateTicketButton.addEventListener('click', function (event) {
            event.preventDefault();
            updateTicket();
        });
        var deleteTicketButton = document.getElementById('deleteTicket');
        deleteTicketButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteTicket();
        });
        var addAssignmentBtn = document.getElementById('addNewAssignment');
        addAssignmentBtn.addEventListener('click', function (event) {
            event.preventDefault();
            var employeeID = document.getElementById("updateAssignedEmployees").value;
            var empList = document.getElementById("updateAssignedEmployees");
            var empName = empList[empList.selectedIndex].innerHTML;
            var table = document.getElementById("assignedEmployeesTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                var col = row.cells[0].innerText;
                if(col === employeeID){
                    return;
                }
             }
            var row = document.getElementById("assignedEmployeesTable").insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = employeeID;
            cell1.setAttribute("style", "display: none;")
            cell2.innerHTML = empName;
            cell3.innerHTML = "<button class=\"btn btn-warning btn-sm remAssignment\">Delete</button>"
        });
        var addAssignmentBtn = document.getElementById('addNewAssignment');
        addAssignmentBtn.addEventListener('click', function (event) {
            event.preventDefault();
            var employeeID = document.getElementById("updateAssignedEmployees").value;
            var empList = document.getElementById("updateAssignedEmployees");
            var empName = empList[empList.selectedIndex].innerHTML;
            var table = document.getElementById("assignedEmployeesTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                var col = row.cells[0].innerText;
                if(col === employeeID){
                    return;
                }
             }
            var row = document.getElementById("assignedEmployeesTable").insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = employeeID;
            cell1.setAttribute("style", "display: none;")
            cell2.innerHTML = empName;
            cell3.innerHTML = "<button class=\"btn btn-warning btn-sm\">Delete</button>"
        });
        var assignmentTable = document.getElementById('assignedEmployeesTable');
        assignmentTable.addEventListener('click', function (event) {
            event.preventDefault();
            var target = event.target;
            if (target.tagName == "BUTTON"){
                var row = target.parentElement.parentElement;
                target.parentElement.parentElement.parentElement.removeChild(row);
            }
        });
    } catch(e) {
        return;
    };
    
})();