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