$(document).ready(function () {

    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    startGame();

});

// var interval = setInterval(update, 40);

// function speedCheck() {
//     MeasureConnectionSpeed();
//     $.get( "/speedcheck" , (okay) => {
//         okay = $.parseJSON(okay);
//         if(okay) {
//             overlay_off();
//         }
//         else {
//             overlay_on();
//         }
//     })
// }

