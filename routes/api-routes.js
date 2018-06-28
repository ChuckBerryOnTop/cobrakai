const logo = require('../models/logo');
const logoseq = require("../models/logoseq");
const db = require("../models");

module.exports = (app) => {
    app.post("/api/logo", (req, res) => {
      //  req.body.key ="SWFtIGdvZCBtb2Z1Y2tlcg=="
        db.ImgAdd.create({
            image: req.body.key,
            
          }).then(function() {
            // We have access to the new todo as an argument inside of the callback function
            res.send("sucess");
            console.log("it hit")
          })
            .catch(function(err) {
            // Whenever a validation or flag fails, an error is thrown
            // We can "catch" the error to prevent it from being "thrown", which could crash our node app
              res.json(err);
            });
        let uniqueRandomImageName;
        try {
            // Decoding base-64 image
            // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
            function decodeBase64Image(dataString) {
                const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
               // const matches= ["","","SWFtIGdvZCBtb2Z1Y2tlcg=="];
                const response = {};

                if (matches.length !== 3) {
                   console.log('Invalid input string');
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

            
            const base64Data = req.body.key;


            const imageBuffer = decodeBase64Image(base64Data);
            const userUploadedFeedMessagesLocation = "./";

            //the piece of code is doing some weird hoisting
            uniqueRandomImageName = 'image-' + uniqueSHA1String;
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
                require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                    function () {
                        // console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                    });
            } catch (error) {
                console.log('ERROR:', error);
                console.log("yoohoo!")
            }

        } catch (error) {
            console.log('ERROR:', error);
            console.log("vomit!!!!")
        }


    logo.logo(uniqueRandomImageName + '.png');

    });


}
