const logo = require('../models/logo');

//var imageS = new Image();
//var imageS = document.createElement('img');
module.exports = (app) => {
    app.post("/api/logo", (req, res) => {
        console.log(JSON.stringify(req.body.key));
        //console.log(req);
        //getLogo(req.body);        
        //logo.logo('jumpman.jpg')
        /*var pic = new Image();
        //image.src = 'data:image/png;base64,iVBORw0K...';
        pic.src = req.body;
        console.log("Image: "+pic.src);*/
        /*
        var src = "data:image/jpeg;base64,";
        src += item_image;
        var newImage = document.createElement('img');
        newImage.src = src;
        newImage.width = newImage.height = "80";
        document.querySelector('#imageContainer').innerHTML = newImage.outerHTML;//where to insert your image
        */
       //var imageS = new Image();
        //imageS.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAAAXNSR0IArs4c6QAAAZhJREFUOBGVk79Lw1AQx+9eU5zcC40u4iLYtBQcpaN0dXBxLeIP6CBugiAIIiooooi4ufgPdC6OYm3TwUVcNIVKR+kgTXPehUZt01TfQZJ33+/nvk2TF4ReUS5n2HcvRUTKA0GagD4AsaoArlJdpyRYPWbmPYACEGUQcBwQakRYsuanTrBcdoVBOT2NmdOdDt0SQEb6UCHe+BrRcshjgUOq8TguzXw6z0jZbNyuNu9ZTw+DNbSalUnMxRbfY1t8Z0N/WSNM0ESr2W4rD2FBczASlywlLyCS0DU4i18itHTnRvAtxdvkcQSgZXFWRXEd8pS/h7Smw7DLWUdqtvP2AAr2w76mwhmSJc8QrO3CDiJea0Z84zIrGSL4X4osiL8h25i8APJWpP93obq03NdVDuXt/CtQGgmtG+YZEaxJ/1chwnnKdTaCMOH9vxwMimF1G+uo8DTQoq7C+GzvzgKuLzAQLdcpKgXHQT94FU+YQV36oYFipNzGJig8kHVfseZ7faJGYxsTezWVJDlkrTEajdaN5K4c0cSP8wV8eoEZjT4J3gAAAABJRU5ErkJggg==";

        //document.body.appendChild(imageS)

      /*  var newFile = new Parse.File("testing.png", imageS);
        newFile.save({
                success: function () {
                    console.log("Image Upload Succces");


                },
                error: function (file, error) {

                    console.log("Image Upload Error" + error.message);

                }


            })*/
            /*function dataURItoBlob(dataURI, type) {
                // convert base64 to raw binary data held in a string
                var byteString = atob(dataURI.split(',')[1]);
            
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            
                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
            
                // write the ArrayBuffer to a blob, and you're done
                var bb = new Blob([ab], { type: type });
                return bb;
            }
           var file = dataURItoBlob(req.body, 'image/png');
           console.log(file);*/
          /* var base64Data = req.body.replace(/^data:image\/png;base64,/, "");

            require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
            console.log(err);
            });*/
            try
    {
        // Decoding base-64 image
        // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
        function decodeBase64Image(dataString) 
        {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          var response = {};

          if (matches.length !== 3) 
          {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        var imageTypeRegularExpression      = /\/(.*?)$/;      

        // Generate random string
        var crypto                          = require('crypto');
        var seed                            = crypto.randomBytes(20);
        var uniqueSHA1String                = crypto
                                               .createHash('sha1')
                                                 .update(seed)
                                                 .digest('hex');

        var temp = JSON.stringify(req.body)
        var base64Data =   req.body.key //JSON.stringify(req.body.key);            //temp.replace(/{|}|:|"/g, "");  
        // JSON.stringify(req.body)   //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFeCAYAAACrXUkIAAAgAElEQVR4Xly997Nl53Ultk648YV+HYFGkwAIkBRJUYkcaWTNTGns8i92uVwu/wOucvk/c9XII4qSSYIgKY0sjaihJIqkAnMCASJ2Nzq8eMNJrrXW3ude8Gl6mnh97wnft78d1l577+I/v/q5AV2JYSgwDAP6skCDHkNZoCxKVChQDkDZT8GfYehQ1sCAHiX4nQLg3z1QFh2KokcPoOSH2x6ToUDPX0wqtMOAoixQ8Lt9h7KvAVTAUKEvWnToMAw9yrJCUVRANaDven+nH3y/AugKoOdFC94bqIpBvy/6Ev1Q6LsFWj4Qqs7f4yd7fib+5rvyp+D9UaPZrjCtK34l3tP/znXoMaDgGgx8/wFF3DfXw//NtfB3y5LrOejaenf06KsCRTk+ste68Gf5bX6Vz87PdlzModd7lR2vUunz+cx1Uep6ra7n50PTYSgqdAX3p8R6u8G3/u4f0T0+x5P79/H4/BwXmy3WmzWGbgNstxi6AeurDTZNi+3QYehb6EULoKq5b1tURYde78In4/ouKS7+2DDo3yfNgLqq0BY9UJfYcM8mLYqe+0ZZKDB0NabFDGU9QVVPtF6zaYmT69dxdn6utZgtFzg8PkKDFtuLC6xOL1H1FcrJEj1qbIs1BnS4Wl1gPu1x9+QQz3/4RUznc2yaDn29xEsvfRQ3bt3E4eEBJtMa5aRH325BScZQYjKZAQPlzmvHlS9Kyk+HYigli9xH7V/ZhSxQcEoURUkJlXzz3flty1ar1SkK/lun9aPcVN0UQ++94z5TZnnPPGc9D0nJ67Soug5VQXkZMPRcn/EUjfvOs8dn5d0afbWQfPA1hr5HVerUWaaLfvyeJFDnskPJk9lzv+rxzOtM6WwPKOIZ9Z2+R1n1lgutiV5M9+jLXrrBR2GQnPO+1geU5gFlsdV763wPJX9jOS5W2G43qGdTlHwO7nHHc8h78L17FFWLcugle70Wiv9uPZVnn3pBz8zb8X1B/TPo7tuCp4Z7w2fmnXsMnZ4qnlG/jvPqveQXee1cq7rinnFfOp0Fy8zE8iMZ4nNxVakvvT5lX6LrOp2DoaLMDGi5SNRhbY+SZyNkoB0aFKXft+x5c8pOJRkbeK4HykGp76a8lt2AoaNuiHenLiw6TPlyfLf4Ls8Q91kyzvXFBN3AZxl4C+uMgvIzSL/wv5uO8kUZbDGdUSda/nm2ZQPKHm1L6fNi8bvFH7/yp9IYXT9os/jgHU99UaIueeh4A77jJF48VrrgBnPhrTgtNqFlpai5IAOqgdeg8uRvvLkUdirIcuACU9ipBGkouIH8BDfGC8SbyyTxmjopfLQCBa8pIeci2aClk'              //'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAZABkAAD/4Q3zaHR0cDovL25zLmFkb2JlLmN...';

        var imageBuffer                      = decodeBase64Image(base64Data);
        var userUploadedFeedMessagesLocation = "C:/Users/dankn/Documents/homework/cobrakai/"                        //'../img/upload/feed/';

        var uniqueRandomImageName            = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        var imageTypeDetected                = imageBuffer
                                                .type
                                                 .match(imageTypeRegularExpression);

        var userUploadedImagePath            = userUploadedFeedMessagesLocation + 
                                               uniqueRandomImageName +
                                               '.' + 
                                               imageTypeDetected[1];

        // Save decoded binary image to disk
        try
        {
        require('fs').writeFile(userUploadedImagePath, imageBuffer.data,  
                                function() 
                                {
                                  console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                                });
        }
        catch(error)
        {
            console.log('ERROR:', error);
        }

    }
    catch(error)
    {
        console.log('ERROR:', error);
    }
    //var fs = require('fs');
// string generated by canvas.toDataURL()
/*var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0"
    + "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO"
    + "3gAAAABJRU5ErkJggg==";*/
 /*   var fs = require('fs');
var img = JSON.stringify(req.body);  
var img2 = img.replace(/{|}|:|"/g, ""); 
console.log(img2);
// strip off the data: url prefix to get just the base64-encoded bytes
 var data = img2.replace(/^data:image\/\w+;base64,/, "");
var buf = new Buffer(data, 'base64');
fs.writeFile('image.png', buf);*/

        logo.logo(uniqueRandomImageName+'.png');

    });


}