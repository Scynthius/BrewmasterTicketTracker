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