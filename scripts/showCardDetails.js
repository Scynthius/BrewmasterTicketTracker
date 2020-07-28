(function () {
    var cardDetailButtons = document.getElementsByClassName('card-show-details');

    for (var i = 0; i < cardDetailButtons.length; i++) {
        cardDetailButtons[i].addEventListener('click', function () {
            showDetails(this);
        })
    }
})();

function showDetails(elem) {
    var cardDetails = elem.closest('.row').nextElementSibling;
    elem.classList.toggle('active');
    cardDetails.classList.toggle('shown');
}