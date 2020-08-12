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

    var successAlert = `<div class="alert alert-success" role="alert">
                            New client <strong>${clientFormFields[0].children[1].value}</strong> created.
                        </div>`;

    var errorAlert =   `<div class="alert alert-danger" role="alert" id="errorAlert">
                            Something went wrong.
                        </div>`;

    var request = new XMLHttpRequest();
    request.open('POST', '/create', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            document.getElementById('clientModalBody').nextElementSibling.remove();
            document.getElementById('clientModalBody').innerHTML = successAlert;
            setTimeout(function () {
                location.reload();
            }, 1000);
        } else {
            document.getElementById('clientModalBody').prepend(errorAlert);
            setTimeout(function () {
                document.getElementById(errorAlert).remove();
            }, 1000);
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