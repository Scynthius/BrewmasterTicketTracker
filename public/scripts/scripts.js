(function () {
    var assignButtonCheck = document.getElementsByClassName('button-assign');

    if (assignButtonCheck.length !== 0) {
        var TicketID;
        function assignTicket() {
            
            var employees = document.getElementsByClassName('employee-names');
            var assigned = [];
            for (var i = 0; i < employees.length; i++) {
                assigned.push(employees[i].value);
            }

            var data = {
                "requestType" : "Assign Ticket",
                "TicketID"    : TicketID,
                "AssignedNum" : employees.length,
                "Assigned"    : assigned
            }

            var request = new XMLHttpRequest();
            request.open('POST', '/create', true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.addEventListener('load', function () {
                if (request.status >= 200 && request.status < 400) {
                    $('#assignModal').modal('hide');
                } else {
                    console.log('Error');
                }
            });
            request.send(JSON.stringify(data));
        };

        function addEmployee() {
            var selectorGroup = document.getElementById('assign_employees');
            var employeeSelector = selectorGroup.children[1];
            var newSelector = employeeSelector.cloneNode(true);
            selectorGroup.appendChild(newSelector);
        }

        var assignButtons = document.getElementsByClassName('button-assign');
        for (var i = 0; i < assignButtons.length; i++) {
            assignButtons[i].addEventListener('click', function (e) {
                e.preventDefault();
                TicketID = this.closest('.card').getAttribute('data-ticketid');
                $('#assignModal').modal('show');
            });
        }

        var addEmployeeButton = document.getElementById('addAnotherEmployee');
        addEmployeeButton.addEventListener('click', function (e) {
            e.preventDefault();
            addEmployee();
        });

        var assignTicketButton = document.getElementById('assignTicket');
        assignTicketButton.addEventListener('click', function(e) {
            e.preventDefault();
            assignTicket();
        });
    }
})();

(function () {
    function createBusinessType() {
        var businessTypeName = document.getElementById('businessType_name');
        var currentDate = getCurrentDate();
        var data = {
            "requestType" : "New Business Type",
            "name"        : businessTypeName.value,
            "date"        : currentDate
        }

        var request = new XMLHttpRequest();
        request.open('POST', '/create', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#businessTypeModal').modal('hide');
                businessType_name.value = '';
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    };

    var createBusinessTypeButton = document.getElementById('createBusinessType');
    createBusinessTypeButton.addEventListener('click', function () {
        createBusinessType();
    });
})();
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
        request.open('POST', '/create', true);
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
    var clientTypes = document.getElementsByName('client_type');
    var typeCount = clientTypes.length;
    var clientFormFields = document.getElementById('add_client').children;
    var clientType = [];

    for (var i = 0; i < typeCount; i++) {
        if (clientTypes[i].checked) {
            clientType.push(clientTypes[i].value);
        }
    }

    var data = {
        "requestType"       : "New Client",
        "ClientTypeCount"   : typeCount,
        "ClientName"        : clientFormFields[0].children[1].value,
        "ClientType"        : clientType,
        "PrimaryContact"    : clientFormFields[2].children[1].value,
        "Email"             : clientFormFields[3].children[1].value,
        "Phone"             : clientFormFields[4].children[1].value,
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/create', true);
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
(function () {
    var createEmployeeButton = document.getElementById('createEmployee');
    createEmployeeButton.addEventListener('click', function () {
        createEmployee();
    });
})();

function createEmployee() {
    var employeeFormFields = document.getElementById('add_employee').children;

    var data = {
        "requestType"       : "New Employee",
        "FirstName"         : employeeFormFields[0].children[0].children[1].value,
        "LastName"          : employeeFormFields[0].children[1].children[1].value,
        "Email"             : employeeFormFields[1].children[0].children[1].value,
        "AccessLevel"       : employeeFormFields[2].children[0].children[1].value
    }

    var request = new XMLHttpRequest();
    request.open('POST', '/create', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            $('#employeeModal').modal('hide');
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
    request.open('POST', '/create', true);
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
    function updateClient() {
        var clientID = document.getElementById("updateClientID").value;
        var clientName = document.getElementById("updateName").value;
        var clientContact = document.getElementById("updateContact").value;
        var clientEmail = document.getElementById("updateEmail").value;
        var clientPhone = document.getElementById("updatePhone").value;
        var types = [];
        var table = document.getElementById("assignedTypesTable");
        try{
            for (var i = 2, row; row = table.rows[i]; i++) {
                var col = row.cells[0].innerText;
                types.push(col);
                }
        } catch {
            
        }
        var data = {
            "ClientID"          : clientID,
            "ClientName"        : clientName,
            "Contact"           : clientContact,
            "Email"             : clientEmail,
            "Phone"             : clientPhone,
            "Types"             : types
        };
        var request = new XMLHttpRequest();
        request.open('PUT', '/client_details', true);
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
    function deleteClient(){
        var clientID = document.getElementById("updateClientID").value;
        var data = {
            "ClientID"        : clientID
        };
        var request = new XMLHttpRequest();
        request.open('DELETE', '/client_details', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#completed-delete').modal({backdrop: 'static', keyboard: false})  
                $('#completed-delete').modal('show');
            } else {
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    }
    try {
        var updateButton = document.getElementById('updateClient');
        updateTicketButton.addEventListener('click', function (event) {
            event.preventDefault();
            updateClient();
        });
        var deleteButton = document.getElementById('deleteClient');
        deleteTicketButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteClient();
        });
        var addTypeBtn = document.getElementById('addNewType');
        addTypeBtn.addEventListener('click', function (event) {
            event.preventDefault();
            var typeID = document.getElementById("updateAssignedTypes").value;
            var typeList = document.getElementById("updateAssignedEmployees");
            var typeName = typeList[typeList.selectedIndex].innerHTML;
            var table = document.getElementById("assignedTypesTable");
            for (var i = 0, row; row = table.rows[i]; i++) {
                var col = row.cells[0].innerText;
                if(col === typeID){
                    return;
                }
             }
            var row = document.getElementById("assignedTypesTable").insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = typeID;
            cell1.setAttribute("style", "display: none;")
            cell2.innerHTML = typeName;
            cell3.innerHTML = "<button class=\"btn btn-warning btn-sm remType\">Delete</button>"
        });
        var types = document.getElementById('assignedTypesTable');
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