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

    var successAlert = `<div class="alert alert-success" role="alert">
                            New ticket <strong>${ticketFormFields[0].children[1].value}</strong> created.
                        </div>`;

    var errorAlert =   `<div class="alert alert-danger" role="alert" id="errorAlert">
                            Something went wrong.
                        </div>`;

    var request = new XMLHttpRequest();
    request.open('POST', '/create', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            document.getElementById('ticketModalBody').nextElementSibling.remove()
            document.getElementById('ticketModalBody').innerHTML = successAlert;
            setTimeout(function () {
                location.reload();
            }, 1000);
        } else {
            document.getElementById('ticketModalBody').prepend(errorAlert);
            setTimeout(function () {
                document.getElementById(errorAlert).remove();
            }, 1000);
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));
};
