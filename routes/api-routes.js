let myRequest;
const path = require("path");

//let myResult = [];
let myResult = {arr1:[], arr2:[], arr3:[]};
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({ keyFilename: "./apikey.json" });


var imageFaceHelper = require("../models/detect.js");


module.exports = (app) => {    
    app.post("/api/logo", (req, res) => {    
        myRequest = req.body.key
        //console.log(myRequest);        
        base64();             
    });

    app.get("/api/logo", function(req, res) {             
        console.log("Res2: "+JSON.stringify(myResult))
        return res.json(myResult);
    }); 

    //This is needed to serve the images
    app.get("/images/:id",function(req,res)
    {
        var name = req.params.id;
        console.log(name);
        var npath = path.join(__dirname, '../images/'+name);
        res.sendFile(npath);
    });

    //this is needed to get the results of the urls we store in the server
    app.get("/api/faceUrl", function(req, res) {                 
        return res.json(imageFaceHelper.detectFaces("./images/imageMain.png")) ;
    }); 
}
async function base64() {   
try
{
    // Decoding base-64 image
    // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
    function decodeBase64Image(dataString) 
    {
      const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let response = {};

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
    const imageTypeRegularExpression      = /\/(.*?)$/;      

    // Generate random string
    const crypto                          = require('crypto');
    const seed                            = crypto.randomBytes(20);
    const uniqueSHA1String                = crypto
                                           .createHash('sha1')
                                             .update(seed)
                                             .digest('hex');
    
   // const base64Data =   req.body.key; 
   const base64Data = myRequest;        

    const imageBuffer                      = decodeBase64Image(base64Data);
    const userUploadedFeedMessagesLocation = "./"    

    const uniqueRandomImageName            = 'image-' + uniqueSHA1String;
    // This variable is actually an array which has 5 values,
    // The [1] value is the real image extension
    const imageTypeDetected                = imageBuffer
                                            .type
                                             .match(imageTypeRegularExpression);

    const userUploadedImagePath            = userUploadedFeedMessagesLocation + 
                                           uniqueRandomImageName +
                                           '.' + 
                                           imageTypeDetected[1];

    // Save decoded binary image to disk
    try
    {
        require('fs').writeFile("./images/imageMain.png", imageBuffer.data,function(){});
                   
        const prom = new Promise(function(resolve, reject) {

        
        require('fs').writeFile(userUploadedImagePath, imageBuffer.data,  
            function() 
            {
                console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);                                
               // myVision(uniqueRandomImageName+'.png');    
                //return uniqueRandomImageName+'.png' 
                resolve(uniqueRandomImageName+'.png')            
            }); 
        });
      
        prom.then(function(value) {
            myResult = {arr1:[], arr2:[], arr3:[]}
            myVision(value);
            myVision2(value);
            myVision4(value);
        })                        
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
}

function myVision(fileName) {
   
    client
        .webDetection(fileName)
        .then(results => {
            const webDetection = results[0].webDetection;    

            if (webDetection.bestGuessLabels.length) {
                console.log(
                `Best guess labels found: ${webDetection.bestGuessLabels.length}`
                );
                webDetection.bestGuessLabels.forEach(label => {
                    console.log(`  Label: ${label.label}`);
                    myResult.arr1.push(label.label);
                    //myResult = label.label;
                    
                    //console.log("res1: "+myResult);
                   
                    //return myResult
                });        
            }
        })
        .catch(err => {
        console.error('ERROR:', err);
        });
}


function myVision2(fileName) {
    client
  .labelDetection(fileName)
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    //labels.forEach(label => console.log(label.description));
    labels.forEach(label => myResult.arr2.push(label.description));
    //myResult.push(label.description);
                    
                    console.log("res1: "+myResult);
                   
                    //return myResult
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

function myVision3(fileName) {
    client
    .logoDetection(fileName)
    .then(results => {
        const logos = results[0].logoAnnotations;
        console.log('Logos:');
        logos.forEach(logo => console.log(logo));
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
}

function myVision4(fileName) {
    client
    .textDetection(fileName)
    .then(results => {
        const detections = results[0].textAnnotations;
        console.log('Text:');
        detections.forEach(text => myResult.arr3.push(text));  //text => console.log(text)
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
}    