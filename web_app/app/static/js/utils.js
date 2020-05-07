function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
  
function okSpeed() {
    document.getElementById("overlay").style.opacity = 0;
    document.getElementById("overlay").style.display = "none"
}

function slowSpeed() {
  document.getElementById("overlay").style.opacity = 100;
  document.getElementById("overlay").style.display = "block";
}

function MeasureConnectionSpeed() {
    var imageAddr = document.getElementById("testimg").getAttribute("src");
    var downloadSize = 1562018; //bytes
    var SPEED_THRESHOLD = 8;
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

        // $.post( "/speedupdate", {
        //   speed: speedMbps 
        // });
    }
    
    startTime = (new Date()).getTime();
    download.src = imageAddr;
    
}