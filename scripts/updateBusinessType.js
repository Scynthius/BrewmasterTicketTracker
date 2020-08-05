(function () {
    function updateBusinessType() {
        var btID = document.getElementById("updateBTID").value;
        var btName = document.getElementById("updateBTName").value;
        
        var data = {
            "TypeID"      : btID,
            "Name"        : btName
        };
        var request = new XMLHttpRequest();
        request.open('PUT', '/business-type_details', true);
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
    function deleteBusinessType(){
        var TypeID = document.getElementById("updateBTID").value;
        var data = {
            "TypeID"        : TypeID
        };
        var request = new XMLHttpRequest();
        request.open('DELETE', '/business-type_details', true);
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
        var updateBTButton = document.getElementById('updateBT');
        updateBTButton.addEventListener('click', function (event) {
            event.preventDefault();
            updateBusinessType();
        });
        var deleteBTButton = document.getElementById('deleteBT');
        deleteBTButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteBusinessType();
        });
    } catch(e) {
        return;
    };
    
})();