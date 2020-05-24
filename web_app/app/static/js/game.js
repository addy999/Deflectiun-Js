var interval = null;
var d = 0;
var id = "abcde";
var game_str = "blah";
var PADDING = 50;

function loadGame() {

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    id = makeid(5); // session id
    
    // Add listeners 
    document.body.onkeydown = captureThrustCommand;
    document.body.onkeyup = captureReleaseThrustCommand;
    navigator.connection.onchange = speedWatch;
    speedWatch(navigator.connection); // initial check


    // Load screen
    var view = document.getElementsByClassName("view")[0];
    var logo = document.getElementById("logo");
    var body = document.body;
    var screen_y = body.clientHeight - logo.clientHeight - PADDING;
    var screen_x = body.clientWidth - PADDING;

    view.style.display = "block";
    view.style.height = screen_y;
    view.style.width = screen_x;

    // Adjust view 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load elements    
    let el = document.getElementById("sc")   
    el.style.left='0px';
    el.style.top='0px';        
    var to_display = Array("stars", "twinkling", "hud");
    to_display.forEach((a) => {
        document.getElementsByClassName(a)[0].style.display = "block";
    })
    document.getElementById("sc").style.display = "block";

    setCmd(0);

    // Draw screen
    $.get( "/load/"+id+"/"+screen_x+"/"+screen_y , update_screen)
    document.getElementById("buttons").children[0].textContent = "Reset Game";
    document.getElementById("buttons").children[1].style.display="unset";
    document.getElementById("buttons").children[2].style.display="unset";
}

function startGame() {

    interval = setInterval(() => {
        var cmd = readCmd();
        $.get( "/get/"+ id + "/" + cmd + "/" + game_str, update_screen);
    }, 70);

    // interval = setInterval(() => {
    //     var cmd = readCmd();
    //     $.post( "/post", {
    //         "id" : id,
    //         "game" : game_str,
    //         "cmd" : cmd,
    //         // "init_orbits" : init_orbits,
    //         // "sc_start_pos" : sc_start_pos,
    //     }, update_screen);
    // }, 70);
}

function pauseGame() {
    clearInterval(interval);
}

function ellipse(context, cx, cy, rx, ry){
    
    context.save(); // save state
    context.beginPath();

    context.translate(cx-rx, cy-ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);

    context.restore(); // restore to original state
    context.lineWidth = 5;
    context.shadowBlur = 0;
    context.strokeStyle = "white";
    context.setLineDash([1, 15]);
    context.stroke();
};

function levelWon(score) {
    
    pauseGame();
    overlayOn( "#0ca1b5cc", "Nice");
    $("#overlay-text").addClass("animate__bounce");

    // Display scores
    var sub = document.getElementById("sub");
    sub.style.display = "block";
    sub.children[0].textContent = "Score = " + String(score[0]);
    $("#sub").addClass("animate__flash");
    // sub.children[0].style.color = "black";
    // sub.children[0].textContent = "- attempt deduction = " + String(score[2]);
    // sub.children[0].style.color = "red";
    // sub.children[0].style.transform = "translate(230px, 0px)";
    // sub.children[1].textContent = "+ gas bonus = " + String(score[1]);
    // sub.children[1].style.color = "blue";
    // sub.children[1].style.transform = "translate(315px, 0px)";

    // Move forward to next scene
    setTimeout(()=> {
        overlayOff();
        $("#overlay-text").removeClass("animate__tada");
        $("#sub").removeClass("animate__flash");

        document.getElementById("msg").textContent="";
        sub.children[0].textContent = "";
        sub.style.display = "none";
        startGame();
    }, 5000);   

}

function gameWon(final_score) {
    
    pauseGame();
    overlayOn( "rgba(0,255,0,0.8)", "You won!");
    $("#overlay-text").addClass("animate__tada");

    // // Display scores
    // var sub = document.getElementById("sub");
    // sub.style.display = "block";
    // sub.children[0].textContent = "Score = " + String(score[0]);
    // $("#sub").addClass("animate__flash");

    // // Move forward to next scene
    // setTimeout(()=> {
    //     overlayOff();
    //     $("#overlay-text").removeClass("animate__tada");
    //     $("#sub").removeClass("animate__flash");

    //     document.getElementById("msg").textContent="";
    //     sub.children[0].textContent = "";
    //     sub.style.display = "none";
    //     startGame();
    // }, 5000);   

}

function update_screen(game_data) {

    var sc_el = document.getElementById("sc");
    var thrusts = Array.from(document.getElementsByClassName("thrusts"));
    var planets = document.getElementsByClassName("planet");
    var canvas = document.getElementById("canvas");
    var cxt = canvas.getContext("2d");

    game_str = game_data;
    game_data = $.parseJSON(game_data);
    // console.log(game_data.level_i);
    // game_str = game_data.bytes.replace(/\s/g, '').replace(/\\/g, "+");

    cxt.clearRect(0, 0, canvas.width, canvas.height)

    if(!game_data){
        overlayOn("black", "server error, Load + Start first.");
        pauseGame();
    }
    else{

        // SC
        sc_el.style.left = game_data.sc.pos[0] - game_data.sc.size[0]/2;
        sc_el.style.top = game_data.scene.size[1] - game_data.sc.pos[1] - game_data.sc.size[1]/2;
        sc_el.style.width = game_data.sc.size[0];
        sc_el.style.height = game_data.sc.size[1];

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
            ellipse(cxt, p_game_data.orbit.center[0], game_data.scene.size[1] -p_game_data.orbit.center[1], p_game_data.orbit.a, p_game_data.orbit.b);        
            // cxt.save(); // save state
            // cxt.fillRect(p_game_data.pos[0], game_data.scene.size[1] -p_game_data.pos[1], 1, 1);
            // cxt.lineWidth = 25;
            // cxt.strokeStyle = "#37ff08";
            // cxt.setLineDash([0,0]);
            // cxt.restore();
            // cxt.stroke();

            // Hide planet if out of screen
            if((0<=  p_game_data.pos[0] - p_game_data.radius) && ( p_game_data.pos[0] - p_game_data.radius <= game_data.scene.size[0]) && (0 <= p_game_data.pos[1] - p_game_data.radius) && (p_game_data.pos[1] - p_game_data.radius <= game_data.scene.size[1])){
                p.style.display = "block";
            }
            else{
                p.style.display = "none";
            }    

        }

        var diff = planets.length - game_data.n_planets;
        if(diff > 0){
            for (let i=game_data.n_planets;i<planets.length;i++){
                planets[i].style.display = "none";
            }
        }


        // Win region
        var points = game_data.scene.win_region;
        cxt.beginPath();
        cxt.lineCap = "round";
        cxt.moveTo(points[0][0], game_data.scene.size[1] - points[0][1]);
        cxt.lineTo(points[1][0], game_data.scene.size[1] - points[1][1]);
        cxt.lineWidth = 25;
        cxt.strokeStyle = "#37ff08";
        cxt.shadowBlur = 30;
        cxt.shadowColor = "green";
        cxt.setLineDash([0,0]);
        cxt.stroke();

        // Hud
        document.getElementById("level").textContent = String(game_data.level_i+1) + "/" + String(game_data.n_levels);
        document.getElementById("speed").textContent = game_data.sc.speed;
        document.getElementById("gas_level").textContent = game_data.sc.gas_level;
        document.getElementById("speed-req").textContent = game_data.scene.win_vel;
        document.getElementById("attempts").textContent = game_data.scene.attempts;
        if(game_data.message.length > 1){document.getElementById("msg").textContent = game_data.message;}

        // Glow
        var max_dist = (game_data.scene.size[0]**2+game_data.scene.size[1]**2)**0.5;
        // var pixel_dist = Math.pow(2.71828,4*(max_dist-game_data.sc.closest_dist_to_planet)/max_dist)-30;
        // document.getElementsByClassName("view")[0].style.boxShadow = "0px 0px 57px " +  pixel_dist.toString() + "px rgba(255,166,0,1)";

        var pixel_dist = Math.pow(2.71828,5*(max_dist-game_data.sc.closest_dist_to_planet)/max_dist);
        if(pixel_dist < 0) {pixel_dist = 0;}
        document.getElementsByClassName("hud")[0].style.boxShadow = "inset 0px 0px " +  pixel_dist.toString() + "px 0px #bd4c21";

        // Win
        if (game_data.done) {
            gameWon();
        }
        else if(game_data.won) {
            levelWon(game_data.scores);
        }
        // if(game_data.fail) {
        //     overlayOn("rgba(255,0,0,0.8)", ":(");
        //     pauseGame();
        // }
    }
}