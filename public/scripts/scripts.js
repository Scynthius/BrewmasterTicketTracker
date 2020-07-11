(function () {
    var entityList = document.getElementById('newEntityList').children;

    for (var i = 0; i < entityList.length; i++) {
        console.log(entityList[i]);
        entityList[i].addEventListener('click', function () {
            alert('Create new ' + this.textContent);
        })
    }
})();