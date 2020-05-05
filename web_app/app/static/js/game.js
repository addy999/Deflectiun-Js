function startGame() {
    // add listeners 
    document.body.onkeydown = captureThrustCommand;
    document.body.onkeyup = captureReleaseThrustCommand;
    // document.body.onmouseout = 

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

