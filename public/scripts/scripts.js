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
