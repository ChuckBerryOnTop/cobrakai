
var vid = document.querySelector("#videoElement");
let localStream;
//const mediaVid = new HTMLMediaElement();
const mediaSource = new MediaSource();
const mediaStream = new MediaStream();





function startCam() {
    $('#snap').show();
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
    $('#snap').hide();  
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
    
    /*const imgFix = dataURL.replace(/data:image\/png;base64,/gi, "")
    console.log("f "+imgFix)
    const matches = dataURL.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    console.log("m "+matches[0]);*/

    const dataSent = {
        key: dataURL
    }
   /* $.post("/api/logo", dataSent,
        function(res) {
            console.log(res)
           /* if (res == 200) {
                //apiResponse()
                setTimeout(apiResponse, 5000)
            }*/
            
        //})
           //setTimeout(apiResponse, 7000);
           
           
    $.ajax({
    type: "POST",
    url: "/api/logo",
    data: dataSent,
    success: ((res) => {
        console.log(res);
        $('#api-result').text(res.arr1);
        $('#api-result2').text(res.arr2);
        $('#api-result3').text(res.arr3);
        
       /* if (res.arr3[0] != undefined) {
            $('#api-result3').text(res.arr3[0].description);
        } else {
            $('#api-result3').text("No text result");
        }*/
        $('#snap').show();
    }),
    dataType: "json"
    });       
}
      
function apiResponse() {
    $.get("/api/logo", function(data) {
        console.log("res");    
        console.log(data)
        $('#api-result').text(data.arr1);
        $('#api-result2').text(data.arr2);
        $('#api-result3').text(data.arr3);
        
      /*  if (data.arr3[0] != undefined) {
            $('#api-result3').text(data.arr3[0]);
        } else {
            $('#api-result3').text("No text result");
        }*/
    });
    $('#snap').show();


    $.get("/display", function(data) {
        //const image = new Image()

        //$('#img').html('<img src="'+data+'">');
      /*  console.log(data);
       // var b64Response = btoa(unescape((data)));
        var b64Response = btoa(unescape(encodeURIComponent(data)))
        //var decode = decodeURIComponent(escape(window.atob(b64Response)));
        var image = new Image();
        image.src = 'data:image/png;base64,'+b64Response;
        document.body.appendChild(image);*/
       /* function b64DecodeUnicode(str) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
        }
        var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
        var img = new Image(1, 1); // width, height values are optional params 
        img.src = imgsrc;
        document.body.appendChild(img);*/
        //var b64Response = btoa(unescape((data)));
        var image = new Image();
        image.src = 'data:image/png;base64,'+data;
        document.body.appendChild(image);
    });    
}  
