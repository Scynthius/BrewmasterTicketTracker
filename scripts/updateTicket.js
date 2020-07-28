(function () {
    function updateTicket() {
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

    var createEmployeeButton = document.getElementById('updateTicket');
    createEmployeeButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateTicket();
    });
})();