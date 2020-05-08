$(document).ready(function () {

    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        // console.log(e.keyCode);
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    startGame();

});

var interval = setInterval(update, 40);
// var speed_check = setInterval(MeasureConnectionSpeed, 10000);
var d = 0;

function update() {
    var cmd = readCmd();
    setTimeout(()=>{$.get( "/get/"+cmd , update_screen)}, 0);
}

function speedCheck() {
    MeasureConnectionSpeed();
    $.get( "/speedcheck" , (okay) => {
        okay = $.parseJSON(okay);
        if(okay) {
            overlay_off();
        }
        else {
            overlay_on();
        }
    })
}

