$(document).ready(function () {
    startGame();
    // var interval = setInterval(update, 40);   


});


var interval = setInterval(update, 40);

function update() {
    var cmd = readCmd();
    setTimeout(()=>{$.get( "/get/"+cmd , update_pos,)}, 0);

}

function update_pos(pos) {
    var el = document.getElementById("sc");
    pos = $.parseJSON(pos);
    el.style.left=pos[0];
    el.style.top=pos[1];
    console.log(pos);
}