$(document).ready(function () {

    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    if(mobileCheck()) {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").textContent = "Warning: This game is currently only meant to be played on a desktop.";
    }

});
