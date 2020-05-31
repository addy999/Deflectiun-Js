var interval = null;
var d = 0;
var id = "abcde";
var game_str = "blah";
var X_PADDING = 100/1423;
var Y_PADDING = 50/755;
var FPS = 70;
var game_on = false;
var MIN_MS = FPS*1.4;

function loadGame() {
    
    overlayOn("rgba(0,0,0,0.5)", "Loading...");
    var r = false
    if (!sessionStorage.getItem("asked_for_tutorial")){
        r = confirm("View tutorial?");
        sessionStorage.setItem("asked_for_tutorial", true);
    }
    if(r) {
        window.location.href = "./tutorial";        
    }
    else {

        document.getElementById("warning").style.display = "block";
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        id = makeid(5); // session id
        
        // Add listeners 
        document.body.onkeydown = captureThrustCommand;
        document.body.onkeyup = captureReleaseThrustCommand;

        // Speed checks
        // navigator.connection.onchange = speedWatch;
        // speedWatch(navigator.connection); // initial check

        // Load screen
        document.getElementById("logo-img").style.width = "25vw";
        var view = document.getElementsByClassName("view")[0];
        var logo = document.getElementById("logo");
        var body = document.body;
        var screen_y = body.clientHeight - logo.clientHeight - Y_PADDING*body.clientHeight;
        var screen_x = body.clientWidth - X_PADDING*body.clientWidth;

        // Adjust view
        view.style.display = "block";
        view.style.height = screen_y;
        view.style.width = screen_x;
        $("#buttons").removeClass("all-center");
        $("#load-btn").removeClass("btn-light");
        $("#load-btn").addClass("btn-info");
        // console.log("translateY(" + screen_y.toString() + " px)", "translateY(" + (screen_y+document.getElementById("buttons").clientHeight).toString() + " px)");
        document.getElementById("buttons").style.transform = "translateY(" + screen_y.toString() + "px)";
        document.getElementsByClassName("footer")[0].style.transform = "translateY(" + (screen_y+document.getElementById("buttons").clientHeight).toString() + "px)";
        document.getElementsByClassName("footer")[0].style.position = "unset";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Load game elements    
        let el = document.getElementById("sc")   
        el.style.left='0px';
        el.style.top='0px';        
        var to_display = Array("stars", "twinkling", "hud");
        to_display.forEach((a) => {
            document.getElementsByClassName(a)[0].style.display = "block";
        })
        document.getElementById("sc").style.display = "block";
        document.getElementById("buttons").children[1].textContent = "Reset Game";
        document.getElementById("msg").textContent="";
        randomizePlanets();

        setCmd(0);

        // Draw screen    
        pauseGame();
        sleep(200);
        // $.get( "/load/"+id+"/"+screen_x+"/"+screen_y , update_screen);
        $.get( {"url" : "/load/"+id+"/"+screen_x+"/"+screen_y , "success" : update_screen, "async":false});
        sleep(200);
        overlayOff();
        startGame();
    }
    
}

function startGame() {

    interval = setInterval(() => {
        var cmd = readCmd();
        var start = new Date().getTime();
        $.get({"url" : "/get/" + cmd + "/" + game_str, "success" : (data)=> {
            var dur = new Date().getTime() - start;
            if (dur >= MIN_MS){
                overlayOn("rgba(0,0,0,0.1)","Waiting for faster comms relay...");
                // over_ms_limit += 1;
            }
            // if (dur >= LARGER_MIN_MS) 
            // {
            //     console.log("Resetting");
            //     pauseGame();
            //     sleep(200);
            //     startGame();
            // }
            // if (over_ms_limit > 5) {

            //     console.log("Resetting");
            //     over_ms_limit = 0;
            //     pauseGame();
            //     // sleep(200);
            //     startGame();
            // }
            else {
                overlayOff();
                // over_ms_limit = 0;
                update_screen(data);
            }
        }, "async" : false});        
        
    }, FPS);
    game_on = true;
}

function pauseGame() {
    clearInterval(interval);
    game_on = false;
}

function toggleGame() {
    if(!game_on) {startGame();}
    else {pauseGame();}
}

function ellipse(context, cx, cy, rx, ry){
    
    context.save(); // save state
    context.beginPath();

    context.translate(cx-rx, cy-ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);

    context.restore(); // restore to original state
    context.lineWidth = 1;
    context.shadowBlur = 0;
    context.strokeStyle = "white";
    // context.setLineDash([1, 15]);
    context.stroke();
};

function levelWon(score) {
    
    pauseGame();
    randomizePlanets();
    overlayOn( "#0ca1b5cc", "Nice");
    $("#overlay-text").addClass("animate__bounce");

    // Display scores
    var sub = document.getElementById("sub");
    sub.style.display = "block";
    sub.children[0].textContent = "Score";
    sub.children[1].textContent = "+" + String(score[0]);
    $("#sub").addClass("animate__flash");

    // Move forward to next scene
    setTimeout(()=> {
        overlayOff();
        $("#overlay-text").removeClass("animate__tada");
        $("#sub").removeClass("animate__flash");

        document.getElementById("msg").textContent="";
        sub.children[0].textContent = "";
        sub.children[1].textContent = "";
        sub.style.display = "none";
        startGame();
    }, 5000);   

}

function gameWon(final_score) {
    
    pauseGame();
    overlayOn( "rgba(0,255,0,0.8)", "You won!");
    $("#overlay-text").addClass("animate__tada");

    // Display scores
    var sub = document.getElementById("sub");
    sub.style.display = "block";
    sub.children[0].textContent = "Final Score"; 
    sub.children[1].textContent = String(final_score);
    $("#sub").addClass("animate__flash");

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
        overlayOn("black", "Server error, try refreshing.");
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
        // var y_offset = document.getElementById("logo").clientHeight + document.getElementsByClassName("view")[0].clientHeight;

        // Planets
        for (let i=1; i<=game_data.n_planets; i++) {

            var p_game_data = game_data["p" + String(i)];
            var p = planets[i-1];
            // console.log("p" + String(i), p_game_data.pos, p_game_data.radius);
            p.style.left = p_game_data.pos[0] - game_data.sc.size[0];
            p.style.top = game_data.scene.size[1] - p_game_data.pos[1] - p_game_data.radius;
            p.style.width = p_game_data.radius * 2;
            p.style.height = p_game_data.radius * 2;
            p.style.transform = "rotate(" + String(d) + "deg)";
            d += 0.2;

            // Orbits
            ellipse(cxt, p_game_data.orbit.center[0], game_data.scene.size[1] -p_game_data.orbit.center[1], p_game_data.orbit.a, p_game_data.orbit.b);        

            // Hide planet if out of screen
            if((0 <=  p_game_data.pos[0] - game_data.sc.size[0]) && (p_game_data.pos[0] - game_data.sc.size[0] <= game_data.scene.size[0]) && (0 <=  game_data.scene.size[1] - p_game_data.pos[1] - p_game_data.radius) && (p_game_data.pos[1] + p_game_data.radius >= 0.0)){
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
            gameWon(game_data.total_score);
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