
var vid = document.querySelector("#videoElement");
let localStream;
//const mediaVid = new HTMLMediaElement();
const mediaSource = new MediaSource();
const mediaStream = new MediaStream();





function startCam() {
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
  
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
  
      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
  .then(function(stream) {
    var video = document.querySelector('video');
    // Older browsers may not have srcObject
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      // Avoid using this in new browsers, as it is going away.
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}

function closeCam() {
    console.log('close');  
    let stream = vid.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

  vid.srcObject = null;

}
 //---------------------
      // TAKE A SNAPSHOT CODE
      //---------------------
var canvas, ctx;

function init() {
    // Get the canvas and obtain a context for
    // drawing in it
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
}

function snapshot() { 
    $('#snap').hide();   
       
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');   
    ctx.drawImage(vid, 0,0, canvas.width, canvas.height);     
    dataURL = canvas.toDataURL('image/png');    
    //console.log(dataURL);
    const dataSent = {
        key: dataURL
    }
    $.post("/api/logo", dataSent,
        function(data, status) {
            
        })
           setTimeout(apiResponse, 5000);             
}
      
function apiResponse() {
    $.get("/api/logo", function(data) {   
    console.log(data)
    $('#api-result').text(data);
    
    });
    $('#snap').show();
}  
