(function () {
    function createCategory() {
        var categoryName = document.getElementById('category_name');
        var currentDate = getCurrentDate();
        var data = {
            "requestType" : "New Category",
            "name"        : categoryName.value,
            "date"        : currentDate
        }

        var request = new XMLHttpRequest();
        request.open('POST', '/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#categoryModal').modal('hide');
                categoryName.value = '';
            } else {
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
/*(function () {
    var entityList = document.getElementById('newEntityList').children;
    var entityModal = document.getElementById('entityModalBody');

    for (var i = 0; i < entityList.length; i++) {
        console.log(entityList[i]);
        entityList[i].addEventListener('click', function () {
            document.getElementById('entityModalName').textContent = this.textContent;
            var fields = createFields(this.textContent.toLowerCase());
            entityModal.innerHTML = fields;
        });
    }
})();

function createFields(entity) {
    var fields;
    var data = {
        "ticket": {
          "fields":{
              "title":{
                "element-type": "input",
                "field-type": "text"
              },
              "description":{
                "element-type": "textarea",
                "field-type": ""
              },
              "client":{
                "element-type": "input",
                "field-type": "text"
              },
              "category":{
                "element-type": "select",
                "field-type": ""
              },
              "submit-date": {
                "element-type": "input",
                "field-type": "datetime"
              }
            }
        }
    };

    switch (entity) {
        case ticket:
            fields = `
                <div class="row">
                    <
                </div>
            `
    }
}*/

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
            $('#ticketModal').modal('hide');
            resetForm(ticketFormFields);
        } else {
            console.log('Error');
        }
    });

    request.send(JSON.stringify(data));
};
function getCurrentDate() {
    var fullDate = new Date();
    var year = String(fullDate.getFullYear());
    var month = String(fullDate.getMonth() + 1).padStart(2, '0');
    var day = String(fullDate.getDate()).padStart(2, '0');

    fullDate = year + '-' + month + '-' + day;

    return fullDate;
}
function resetForm(formElement) {
    for (var i = 0; i < formElement.length; i++) {
        formElement[i].children[1].value = '';
    }
}