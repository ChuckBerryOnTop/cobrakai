
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
    navigator.mediaDevices.getUserMedia = function (constraints) {

      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function (stream) {
      var video = document.querySelector('video');
      // Older browsers may not have srcObject
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

function closeCam() {
  console.log('close');
  let stream = vid.srcObject;
  let tracks = stream.getTracks();
    console.log('close');
    $('#snap').hide();  
    let stream = vid.srcObject;
    let tracks = stream.getTracks();

  tracks.forEach(function (track) {
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
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  dataURL = canvas.toDataURL('image/png');
  //console.log(dataURL);
  const dataSent = {
    key: dataURL
  }
  $.post("/api/logo", dataSent,
    function (data, status) {

    })
  setTimeout(apiResponse, 5000);
  function apiResponse() {
    $.get("/api/logo", function (data) {
      console.log("res");
      console.log(data)
      $('#api-result').text(data.arr1);
      $('#api-result2').text(data.arr2);
      if (data.arr3[0] != undefined) {
        $('#api-result3').text(data.arr3[0].description);
      } else {
        $('#api-result3').text("No text result");
      }
    }).then(function () {
      $.get("/api/faceUrl", function (data) {
        let response = JSON.parse(data);
        console.log(response);
        let count = response.faceCount;
        console.log(count);
        let img = response.imgUrls;
        console.log(img);
        $('#photos').text("");
        if (count > 0) {
          $('#faceTag').text('Face '+count+' Detected');
          for (var ii = 0; ii < count; ii++) {
            var arr = response.imgUrls;
            console.log(arr[ii]);
            displayImageFaces(arr[ii], 1);
          }
        }
        else{
          $('#faceTag').text('No Face Detected');
        }
      });

    });
  }
  $('#snap').show();
}


function getRandomSize(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function displayImageFaces(fileSourceURL, count = 0) {
  for (var i = 0; i < count; i++) {
    var width = getRandomSize(200, 400);
    var height = getRandomSize(200, 400);
    $('#photos').append('<img src="' + fileSourceURL + '" alt="">');
    $("#photos").css("background-color", "yellow");
    $("#photos").css("outline", "5px dotted green");
  }
}

function apiResponse() {
    $.get("/api/logo", function(data) {
        console.log("res");    
        console.log(data)
        $('#api-result').text(data.arr1);
        $('#api-result2').text(data.arr2);
        $('#api-result3').text(data.arr3);
        
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

////// click button for history check it out
$(".dbHistory").on("click", function(event) {
    event.preventDefault();
    $.get("/api/logo", function(data) {
      if (data.length !== 0) {
    
        for (let i = 0; i < data.length; i++) {
    
          let image = new Image();
          image.src = `data:image/png;base64,${data[i].file}`;
          var div = $("<div style='background:blue;'></div>")
          var row = $("<div>");
          row.addClass("lineItem");
          row.append(div);
    
          div.append(`<p>ID ${data[i].id}:<br> Best Guess: ${data[i].name}<br>Description: ${data[i].summary} <br>Labels: ${data[i].labels} <br>Text Read: ${data[i].text}</p>`);
         // row.append(`<div>ID ${data[i].id}</div><br>`) 
        /*  .append (`Best Guess: ${data[i].name}<br>`) 
          .append(`Description: ${data[i].summary}<br>`) 
          .append(`Labels: ${data[i].labels}<br>`) 
          .append(`Text Read: ${data[i].text}<br>`)*/
         
         // row.append("<p>At " + moment(data[i].created_at).format("h:mma on dddd") + "</p>");
          $(".history").prepend(row);
    
        }
    
      }
    
    })
});    
