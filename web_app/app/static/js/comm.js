function sendCmd(cmd) {
    // console.log("Sending command", cmd);
   
    let r = $.post( "/step", {
        cmd : cmd,
    });

}