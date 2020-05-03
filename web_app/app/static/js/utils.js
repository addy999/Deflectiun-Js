// function sleep (time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
//   }

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
  
function overlay_off() {
    document.getElementById("overlay").style.opacity = 0;
    sleep(500).then( ()=> {
      document.getElementById("overlay").style.display = "none";
    })
  }