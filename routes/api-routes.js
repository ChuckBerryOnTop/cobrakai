const logo = require('../models/logo');

module.exports = (app) => {
    app.post("/api/logo", (req, res) => {
        console.log(JSON.stringify(req.body.key));
        let uniqueRandomImageName;
        try {
            // Decoding base-64 image
            // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
            function decodeBase64Image(dataString) {
                const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                const response = {};

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

            
            const base64Data = req.body.key;


            const imageBuffer = decodeBase64Image(base64Data);
            const userUploadedFeedMessagesLocation = "/Users/jeffreylee/Desktop/Homework/cobrakai/";

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
                        console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                    });
            } catch (error) {
                console.log('ERROR:', error);
            }

        } catch (error) {
            console.log('ERROR:', error);
        }


        logo.logo(uniqueRandomImageName + '.png');

    });


}
