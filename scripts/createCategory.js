(function () {
    function createCategory() {
        var categoryName = document.getElementById('category_name');
        var currentDate = getCurrentDate();
        var data = {
            "requestType" : "New Category",
            "name"        : categoryName.value,
            "date"        : currentDate
        }

        var successAlert = `<div class="alert alert-success" role="alert">
                                New category <strong>${categoryName.value}</strong> created.
                            </div>`;

        var errorAlert =   `<div class="alert alert-danger" role="alert" id="errorAlert">
                                Something went wrong.
                            </div>`;

        var request = new XMLHttpRequest();
        request.open('POST', '/create', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                document.getElementById('categoryModalBody').nextElementSibling.remove();
                document.getElementById('categoryModalBody').innerHTML = successAlert;
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                document.getElementById('categoryModalBody').prepend(errorAlert);
                setTimeout(function () {
                    document.getElementById(errorAlert).remove();
                }, 1000);
                console.log('Error');
            }
        });
        request.send(JSON.stringify(data));
    };

    var createCategoryButton = document.getElementById('createCategory');
    createCategoryButton.addEventListener('click', function () {
        createCategory();
    });
})();