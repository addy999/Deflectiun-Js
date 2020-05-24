function sendCmd(cmd) {
    let r = $.post( "/step", {
        cmd : cmd,
    });
}

function readCmd() {
    return parseInt(document.body.getAttribute("key"))
}

function setCmd(cmd) {
    document.body.setAttribute("key", cmd);
}

function captureThrustCommand(e){				
    var key_code=e.which||e.keyCode;
    var command = 0;

    if (key_code==37 || key_code==65){command = 2;} //left arrow / a
    if (key_code==38 || key_code==87){command = 1;} //Up arrow / w
    if (key_code==39 || key_code==68){command = 4;} //right arrow / d
    if (key_code==40 || key_code==83){command = 3;} //down arrow / s 	
    if (key_code==32) {
        // Pause / resume game on spacebar
        toggleGame();
    }			

    setCmd(command);
}

function captureReleaseThrustCommand(e) {
    var key_code=e.which||e.keyCode;
    if ((37 <= key_code && key_code <= 40) || (key_code==65 || key_code == 87 || key_code==68 ||key_code==83)) {
        setCmd(0);
    }
}