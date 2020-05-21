var SPEED_THRESHOLD = 0; // mbps
var imageAddr = "../static/images/test.png";

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

function overlayOff() {
  var el = document.getElementById("overlay");
  el.style.opacity = 0;
  // el.style.backgroundColor = "none";
  // sleep(500);
  el.style.display = "none"
}

function overlayOn(color, text) {
  var el = document.getElementById("overlay");
  el.style.display = "block"
  el.style.opacity = 100;
  // sleep(500);
  el.style.backgroundColor = color;
  el.children[0].textContent = text;
}
  
function okSpeed() {
  overlayOff();
}

function slowSpeed() {
  overlayOn("black", "Slow Speed bro.")
}

function speedWatch(e){

  console.log("Speed", navigator.connection.downlink, "mbps");
  if (navigator.connection.downlink < SPEED_THRESHOLD && navigator.connection.downlink != 0.15) {
    slowSpeed();
  }
  else {
    okSpeed();
  }

}

function MeasureConnectionSpeed() {
    var downloadSize = 1562018; //bytes
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        console.log("Speed", speedMbps, "mbps")

        if(speedMbps<SPEED_THRESHOLD){
          slowSpeed();
        }
        else {
          okSpeed();
        }
    }
    
    startTime = (new Date()).getTime();
    download.src = imageAddr;
    
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}