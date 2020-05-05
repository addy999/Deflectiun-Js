$(document).ready(function () {
    startGame();
    // var interval = setInterval(update, 40);   

});


var interval = setInterval(update, 40);

function update() {
    var cmd = readCmd();
    setTimeout(()=>{$.get( "/get/"+cmd , update_screen)}, 0);

}

function update_screen(status) {
    var sc_el = document.getElementById("sc");
    var sc_sym_el = document.getElementById("sc_symbol")
    var planets = document.getElementsByClassName("planet");
    status = $.parseJSON(status);
    // console.log(status);

    // SC
    sc_el.style.left = status.sc.pos[0];
    sc_el.style.top = status.screen[1]-status.sc.pos[1];
    sc_el.style.width = status.sc.size[0];
    sc_el.style.height = status.sc.size[1];
    sc_el.style.transform = "rotate(" + String(status.sc.rot) + "rad)";

    // Planets
    for (let i=1; i<=status.n_planets; i++) {
        var p_status = status["p" + String(i)];
        var p = planets[i-1];
        p.style.left = p_status.pos[0];
        p.style.top = status.screen[1]-p_status.pos[1];
    }
    

    console.log("Rot", status.sc.rot*180/3.14159, "Thurust", status.sc.thrust.on, status.sc.thrust.dir);
}