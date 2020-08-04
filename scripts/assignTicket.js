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