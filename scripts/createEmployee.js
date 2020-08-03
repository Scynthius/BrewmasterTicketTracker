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
    request.open('POST', '/', true);
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