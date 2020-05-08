function startGame() {

    okSpeed();
    
    // Add listeners 
    document.body.onkeydown = captureThrustCommand;
    document.body.onkeyup = captureReleaseThrustCommand;
    navigator.connection.onchange = speedWatch;
    MeasureConnectionSpeed(); // iniital check

    // Adjust view 
    var e = document.getElementById("canvas")
    e.width = e.offsetWidth;
    e.height = e.offsetHeight;
    
    let el = document.getElementById("sc")   
    el.style.left='0px';
    el.style.top='0px';    
    setCmd(0);

}

function exitGame() {
    // remove listeners 
    document.body.onkeydown = null;
    document.body.onkeyup = null;

}

function readCmd() {
    return parseInt(document.body.getAttribute("key"))
}

function setCmd(cmd) {
    document.body.setAttribute("key", cmd);
    // sendCmd(cmd);
}

function captureThrustCommand(e){				
    var key_code=e.which||e.keyCode;
    var command = 0;
    if (37 <= key_code && key_code <= 40) {
        switch(key_code){
            case 37: //left arrow key
                command = 2;
                break;
            case 38: //Up arrow key
                command = 1;
                break;
            case 39: //right arrow key
                command = 4;
                break;
            case 40: //down arrow key
                command = 3;
                break;						
        }
        
        setCmd(command);
    }
}

function captureReleaseThrustCommand(e) {
    var key_code=e.which||e.keyCode;
    if (37 <= key_code && key_code <= 40) {
        setCmd(0);
    }
}

function ellipse(context, cx, cy, rx, ry){
    context.save(); // save state
    context.beginPath();

    context.translate(cx-rx, cy-ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);

    context.restore(); // restore to original state
    context.lineWidth = 5;
    context.strokeStyle = "white";
    context.setLineDash([1, 15]);
    context.stroke();
};

function update_screen(game_data) {

    // t0 = performance.now();
    var sc_el = document.getElementById("sc");
    var thrusts = Array.from(document.getElementsByClassName("thrusts"));
    var planets = document.getElementsByClassName("planet");
    var cxt = document.getElementById("canvas").getContext("2d");
    game_data = $.parseJSON(game_data);

    // SC
    sc_el.style.left = game_data.sc.pos[0] - game_data.sc.size[0]/2;
    sc_el.style.top = game_data.scene.size[1] - game_data.sc.pos[1] - game_data.sc.size[1]/2;
    sc_el.style.width = game_data.sc.size[0];
    sc_el.style.height = game_data.sc.size[1];

    // Styling
    sc_el.style.boxShadow = "0px 0px 0px 0px rgba(255,255,255,0.25)";
    sc_el.style.borderRadius = "90%";
    sc_el.style.backgroundColor = "rgba(255,255,255,0)";

    if (game_data.sc.thrust.on) {
        sc_el.style.boxShadow = "0px 0px 20px 5px rgba(255,255,255,0.5)";
        sc_el.style.backgroundColor = "rgba(255,255,255,0.25)";
    }

    // SC Img
    thrusts.forEach(element => {
        if(element.id!=game_data.sc.thrust.dir){
            element.style.display="none";
        }
        else{
            element.style.display="block";
            element.style.transform = "rotate(" + String(-1*game_data.sc.rot) + "rad)";
        }
    });

    var sc_img = document.getElementById(game_data.sc.thrust.dir);
    sc_img.style.transform = "rotate(" + String(-1*game_data.sc.rot) + "rad)";

    // Planets
    for (let i=1; i<=game_data.n_planets; i++) {

        var p_game_data = game_data["p" + String(i)];
        var p = planets[i-1];
        p.style.left = p_game_data.pos[0] - p_game_data.radius;
        p.style.top = game_data.scene.size[1] - p_game_data.pos[1] - p_game_data.radius;
        p.style.width = p_game_data.radius * 2;
        p.style.height = p_game_data.radius * 2;
        p.style.transform = "rotate(" + String(d) + "deg)";
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
}