$(document).ready(function () {

    startGame();

    // var interval = setInterval(update, 40);
    // var speed_check = setInterval(MeasureConnectionSpeed, 10000);

});

var interval = setInterval(update, 40);
var speed_check = setInterval(MeasureConnectionSpeed, 10000);
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

function ellipse(context, cx, cy, rx, ry){
    context.save(); // save state
    context.beginPath();

    context.translate(cx-rx, cy-ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);

    context.restore(); // restore to original state
    context.stroke();
};

function update_screen(game_data) {

    // t0 = performance.now();
    var sc_el = document.getElementById("sc");
    var sc_sym_el = document.getElementById("sc-symbol")
    var planets = document.getElementsByClassName("planet");
    var cxt = document.getElementById("canvas").getContext("2d");
    game_data = $.parseJSON(game_data);

    // SC
    sc_el.style.left = game_data.sc.pos[0] - game_data.sc.size[0]/2;
    sc_el.style.top = game_data.scene.size[1] - game_data.sc.pos[1] - game_data.sc.size[1]/2;
    sc_el.style.width = game_data.sc.size[0];
    sc_el.style.height = game_data.sc.size[1];
    sc_sym_el.style.transform = "rotate(" + String(-1*game_data.sc.rot) + "rad)";

    // Planets
    for (let i=1; i<=game_data.n_planets; i++) {

        var p_game_data = game_data["p" + String(i)];
        var p = planets[i-1];
        p.style.left = p_game_data.pos[0] - p_game_data.radius;
        p.style.top = game_data.scene.size[1] - p_game_data.pos[1] - p_game_data.radius;
        p.style.width = p_game_data.radius * 2;
        p.style.height = p_game_data.radius * 2;
        p.children[0].style.transform = "rotate(" + String(d) + "deg)";
        d += 0.1;

        // Orbits
        ellipse(cxt, p_game_data.orbit.center[0], p_game_data.orbit.center[1], p_game_data.orbit.a, p_game_data.orbit.b);
        if((0<=  p_game_data.pos[0] - p_game_data.radius) && ( p_game_data.pos[0] - p_game_data.radius <= game_data.scene.size[0]) && (0 <= p_game_data.pos[1] - p_game_data.radius) && (p_game_data.pos[1] - p_game_data.radius <= game_data.scene.size[1])){
            p.style.display = "block";
        }
        else{
            p.style.display = "none";
        }    

    }

    // if(game_data.speed) {
    //     overlay_off();
    // }
    // else {
    //     overlay_on();
    // }
}