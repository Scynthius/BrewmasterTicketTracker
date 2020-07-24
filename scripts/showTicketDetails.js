(function () {
    var ticketDetailButtons = document.getElementsByClassName('ticket-show-details');

    for (var i = 0; i < ticketDetailButtons.length; i++) {
        ticketDetailButtons[i].addEventListener('click', function () {
            showDetails(this);
        })
    }
})();

function showDetails(elem) {
    var ticketDetails = elem.closest('.row').nextElementSibling;
    elem.classList.toggle('active');
    ticketDetails.classList.toggle('shown');
}