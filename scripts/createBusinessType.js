(function () {
    function createBusinessType() {
        var businessTypeName = document.getElementById('businessType_name');
        var currentDate = getCurrentDate();
        var data = {
            "requestType" : "New Business Type",
            "name"        : businessTypeName.value,
            "date"        : currentDate
        }

        var successAlert = `<div class="alert alert-success" role="alert">
                                New business type <strong>${businessTypeName.value}</strong> created.
                            </div>`;

        var errorAlert =   `<div class="alert alert-danger" role="alert" id="errorAlert">
                                Something went wrong.
                            </div>`;

        var request = new XMLHttpRequest();
        request.open('POST', '/create', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                document.getElementById('businessTypeModalBody').nextElementSibling.remove();
                document.getElementById('businessTypeModalBody').innerHTML = successAlert;
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                document.getElementById('businessTypeModalBody').prepend(errorAlert);
                setTimeout(function () {
                    document.getElementById(errorAlert).remove();
                }, 1000);
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