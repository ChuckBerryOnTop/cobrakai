let myRequest;
let myResult;
let wiki;
const axios = require("axios");
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
    keyFilename: "./apikey.json"
});
const logoseq = require("../models/logoseq");
const db = require("../models");

module.exports = (app) => {
    app.post("/api/logo", (req, res) => {

        myRequest = req.body.key
        // console.log(myRequest);        
        base64();
    });


    /// utilize this here for final product!!!!!!!!
    app.get("/api/logo", function(req, res) {

        // Finding all Chirps, and then returning them to the user as JSON.
        // Sequelize queries are asynchronous, which helps with perceived speed.
        // If we want something to be guaranteed to happen after the query, we'll use
        // the .then function
        db.Classify.findAll({}).then(function(results) {
          // results are available to us inside the .then
          res.json(results);
        });
    
      });
}

function create(log1, log2) {

    db.Classify.create({

        name: log1,
        summary: log2

    })
    //    })      .then(function() {
    //     // We have access to the new todo as an argument inside of the callback function
    //     res.send("sucess");

    //   })
    //     .catch(function(err) {
    //     // Whenever a validation or flag fails, an error is thrown
    //     // We can "catch" the error to prevent it from being "thrown", which could crash our node app
    //       res.json(err);
    //     });
}



async function base64() {
    try {
        // Decoding base-64 image
        // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
        function decodeBase64Image(dataString) {
            const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        }

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        const imageTypeRegularExpression = /\/(.*?)$/;

        // Generate random string
        const crypto = require('crypto');
        const seed = crypto.randomBytes(20);
        const uniqueSHA1String = crypto
            .createHash('sha1')
            .update(seed)
            .digest('hex');

        // const base64Data =   req.body.key; 
        const base64Data = myRequest;

        const imageBuffer = decodeBase64Image(base64Data);
        const userUploadedFeedMessagesLocation = "./"

        const uniqueRandomImageName = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        const imageTypeDetected = imageBuffer
            .type
            .match(imageTypeRegularExpression);

        const userUploadedImagePath = userUploadedFeedMessagesLocation +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];

        // Save decoded binary image to disk
        try {
            const prom = new Promise(function (resolve, reject) {


                require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                    function () {
                        console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                        // myVision(uniqueRandomImageName+'.png');    
                        //return uniqueRandomImageName+'.png' 
                        resolve(uniqueRandomImageName + '.png')
                    });
            });
            prom.then(function (value) {
                myVision(value)
            })
        } catch (error) {
            console.log('ERROR:', error);
            console.log("vomit!!!!")
        }
    } catch (error) {
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
                    myResult = label.label;

                    //axios api call 
                    var searchTerm = label.label;
                    var url2 = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;

                    axios.get(url2)
                        .then(function (response) {
                            console.log(response.data.extract);
                            create(myResult, response.data.extract);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    
                    return myResult;
                });
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}
