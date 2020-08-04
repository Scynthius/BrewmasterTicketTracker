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