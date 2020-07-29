
(function () {
    function createCategory() {
        var categoryName = document.getElementById('category_name');
        var currentDate = getCurrentDate();
        var data = {
            "requestType" : "New Category",
            "name"        : categoryName.value,
            "date"        : currentDate
        }

        var request = new XMLHttpRequest();
        request.open('POST', '/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#categoryModal').modal('hide');
                categoryName.value = '';
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    };

    var createCategoryButton = document.getElementById('createCategory');
    createCategoryButton.addEventListener('click', function () {
        createCategory();
    });
})();
(function () {
    var createClientButton = document.getElementById('createClient');
    createClientButton.addEventListener('click', function () {
        createClient();
    });
})();

function createClient() {
    var clientFormFields = document.getElementById('add_client').children;
    var data = {
        "requestType"       : "New Client",
        "ClientName"        : clientFormFields[0].children[1].value,
        "PrimaryContact"    : clientFormFields[1].children[1].value,
        "Email"             : clientFormFields[2].children[1].value,
        "Phone"             : clientFormFields[3].children[1].value
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            $('#clientModal').modal('hide');
            resetForm(clientFormFields);
        } else {
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));
};

function resetForm(formElement) {
    for (var i = 0; i < formElement.length; i++) {
        formElement[i].children[1].value = '';
    }
}
/*(function () {
    var entityList = document.getElementById('newEntityList').children;
    var entityModal = document.getElementById('entityModalBody');

    for (var i = 0; i < entityList.length; i++) {
        console.log(entityList[i]);
        entityList[i].addEventListener('click', function () {
            document.getElementById('entityModalName').textContent = this.textContent;
            var fields = createFields(this.textContent.toLowerCase());
            entityModal.innerHTML = fields;
        });
    }
})();

function createFields(entity) {
    var fields;
    var data = {
        "ticket": {
          "fields":{
              "title":{
                "element-type": "input",
                "field-type": "text"
              },
              "description":{
                "element-type": "textarea",
                "field-type": ""
              },
              "client":{
                "element-type": "input",
                "field-type": "text"
              },
              "category":{
                "element-type": "select",
                "field-type": ""
              },
              "submit-date": {
                "element-type": "input",
                "field-type": "datetime"
              }
            }
        }
    };

    switch (entity) {
        case ticket:
            fields = `
                <div class="row">
                    <
                </div>
            `
    }
}*/

(function () {
    var createTicketButton = document.getElementById('createTicket');
    createTicketButton.addEventListener('click', function () {
        createTicket();
    });
})();

function createTicket() {
    var ticketFormFields = document.getElementById('add_ticket').children;
    var currentDate = getCurrentDate();
    var data = {
        "requestType"   : "New Ticket",
        "Title"         : ticketFormFields[0].children[1].value,
        "Description"   : ticketFormFields[1].children[1].value,
        "ClientID"      : ticketFormFields[2].children[1].value,
        "CategoryID"    : ticketFormFields[3].children[1].value,
        "Status"        : "Unassigned",
        "SubmitDate"    : currentDate
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            $('#ticketModal').modal('hide');
            resetForm(ticketFormFields);
        } else {
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));
};

function getCurrentDate() {
    var fullDate = new Date();
    var year = String(fullDate.getFullYear());
    var month = String(fullDate.getMonth() + 1).padStart(2, '0');
    var day = String(fullDate.getDate()).padStart(2, '0');

    fullDate = year + '-' + month + '-' + day;

    return fullDate;
}
function resetForm(formElement) {
    for (var i = 0; i < formElement.length; i++) {
        formElement[i].children[1].value = '';
    }
}
(function () {
    var cardDetailButtons = document.getElementsByClassName('card-show-details');

    for (var i = 0; i < cardDetailButtons.length; i++) {
        cardDetailButtons[i].addEventListener('click', function () {
            showDetails(this);
        })
    }
})();

function showDetails(elem) {
    var cardDetails = elem.closest('.row').nextElementSibling;
    elem.classList.toggle('active');
    cardDetails.classList.toggle('shown');
}

(function () {
    function updateEmployee() {
        var employeeID = document.getElementById("updateEmployeeID").value;
        var employeeFN = document.getElementById("updateFirstName").value;
        var employeeLN = document.getElementById("updateLastName").value;
        var employeeMail = document.getElementById("updateEmpEmail").value;
        var access = document.getElementById("updateAccessLevel").value;
        var data = {
            "EmployeeID"        : employeeID,
            "FirstName"         : employeeFN,
            "LastName"          : employeeLN,
            "Email"             : employeeMail,
            "AccessLevel"       : access
        };
        var request = new XMLHttpRequest();
        request.open('PUT', '/employee_details', true);
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
    function deleteEmployee(){
        var employeeID = document.getElementById("updateEmployeeID").value;
        var data = {
            "EmployeeID" : employeeID
        }
        var request = new XMLHttpRequest();
        request.open('DELETE', '/employee_details', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#completed-delete').modal('show');
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    };
    try {
        var updateEmployeeButton = document.getElementById('updateEmployee');
        updateEmployeeButton.addEventListener('click', function (event) {
            event.preventDefault();
            updateEmployee();
        });
        var deleteEmployeeButton = document.getElementById('deleteEmployee');
        deleteEmployeeButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteEmployee();
        });
    } catch(e) {
        return
    }
})();
(function () {
    function updateTicket() {
        var ticketID = document.getElementById("updateTicketID").value;
        var ticketTitle = document.getElementById("updateTitle").value;
        var ticketDesc = document.getElementById("updateDescription").value;
        var ticketCat = document.getElementById("updateCategory").value;
        var ticketClient = document.getElementById("updateClientList").value;
        var ticketStatus = document.getElementById("updateStatus").value;
        var ticketRes = document.getElementById("updateResolution").value;
        var assignments = [];
        var table = document.getElementById("assignedEmployeesTable");
        try{
            for (var i = 2, row; row = table.rows[i]; i++) {
                var col = row.cells[0].innerText;
                assignments.push(col);
                }
        } catch {
            
        }
        
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