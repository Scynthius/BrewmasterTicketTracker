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
            $('#ticketModal .modal-body > .row').fadeOut();
            $('#ticketModal .modal-body').prepend('<div class="alert alert-success" role="alert">Ticket successfully created!</div>');
            setTimeout(function(){ 
                $('#ticketModal').modal('hide');
            }, 1000);
            $('#ticketModal .modal-body > .row').show();
            $('#createTicket').remove('.spinner-border');
            resetForm(ticketFormFields);
        } else {
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));

    var spinner = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    $('#createTicket').prepend(spinner);
};
