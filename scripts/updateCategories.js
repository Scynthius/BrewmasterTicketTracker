(function () {
    function updateCategory() {
        var catID = document.getElementById("updateCatID").value;
        var catName = document.getElementById("updateCatName").value;
        
        var data = {
            "CategoryID"     : catID,
            "Name"           : catName
        };
        var request = new XMLHttpRequest();
        request.open('PUT', '/category_details', true);
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
    function deleteCategory(){
        var catID = document.getElementById("updateCatID").value;
        var data = {
            "CategoryID"        : catID
        };
        var request = new XMLHttpRequest();
        request.open('DELETE', '/category_details', true);
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
        var updateCatButton = document.getElementById('updateCat');
        updateCatButton.addEventListener('click', function (event) {
            event.preventDefault();
            updateCategory();
        });
        var deleteCatButton = document.getElementById('deleteCat');
        deleteCatButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteCategory();
        });
    } catch(e) {
        return;
    };
    
})();