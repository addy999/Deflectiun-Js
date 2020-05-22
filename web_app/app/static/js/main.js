$(document).ready(function () {

    // var socket = io.connect('http://' + document.domain + ':' + location.port);
    // socket.on('my response', function(msg) {
    //    console.log(msg.data);
    // });

    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    document.getElementById("buttons").children[1].style.display="none";
    document.getElementById("buttons").children[2].style.display="none";

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

