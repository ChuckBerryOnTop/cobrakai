let myRequest;

let myResult = {
    arr1: [],
    arr2: [],
    arr3: []
};
require("dotenv").config()
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({   //keyFilename: "./VidWall-e4a178d8b757.json"
    type: process.env.type,
    project_id: process.env.project_id.process,
    private_key_id: process.env.private_key_id,
    private_key: private_key.process.env,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
});

let wiki;
const axios = require("axios");
const db = require("../models");

module.exports = (app) => {
    app.post("/api/logo", (req, res) => {
        myRequest = req.body.key
        myResult = {
            arr1: [],
            arr2: [],
            arr3: []
        }
        
        async function callVis(fileName) {
            myResult.arr1 = await myVision(fileName);
            myResult.arr2 = await myVision2(fileName);
            myResult.arr3 = await myVision4(fileName);
            create(myResult.arr1[0], myResult.arr1[1], myResult.arr2[0], myResult.arr3[0], fileName)
            console.log("myResult: " + JSON.stringify(myResult));
            res.json(myResult)
        }
        
        prom1 = new Promise((resolve, reject) => {
            const imgFix = myRequest.replace(/data:image\/png;base64,/gi, "")
            let img = new Buffer(imgFix, 'base64');
            const fileName = 'a-img' + rnd() + rnd() + rnd();
            require('fs').writeFile("./" + fileName + '.png', img, function () {
                console.log('FILE SAVED AS: ' + fileName + '.png');
                resolve(fileName + '.png');
            })

            function rnd() {
                const rnd = Math.floor(Math.random() * 10);
                return rnd;
            }
        });
        prom1.then((value) => {
                callVis(value);
            })
            .catch((err) => {
                console.log("ERROR: " + err)
            })
    });

    app.get("/api/logo", function (req, res) {
        db.Classify.findAll({}).then(function (results) {
            res.json(results);
        })
    });

    app.get('/display', function (req, res) {

        require('fs').readFile('img.png', function (err, data) {
            if (err) throw err; // Fail if the file can't be read.
            else {
                const data64 = Buffer.from(data).toString('base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png'
                });
                res.end(data64); // Send the file data to the browser.
            }
        });
    });
}

function myVision(fileName) {
    return new Promise((resolve) => {
        let myArray = [];
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
                        myArray.push(label.label);

                        var searchTerm = label.label;
                        var url2 = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;

                        axios.get(url2)
                            .then(function (response) {
                                console.log(response.data.extract);
                                myArray.push(response.data.extract);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                        resolve(myArray);
                    });
                }
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })
}

function myVision2(fileName) {
    return new Promise((resolve) => {
        let myArray = []
        client
            .labelDetection(fileName)
            .then(results => {
                const labels = results[0].labelAnnotations;
                console.log('Labels:');                
                labels.forEach(label => myArray.push(label.description)); 
                console.log("res1: " + myArray);
                resolve(myArray);             
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })
}

function myVision3(fileName) {
    return new Promise((resolve) => {
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
    })
}

function myVision4(fileName) {
    return new Promise((resolve) => {
        let myArray = [];
        client
            .textDetection(fileName)
            .then(results => {
                const detections = results[0].textAnnotations;
                console.log('Text:');
                detections.forEach(text => myArray.push(text.description)); 
                if (myArray[0] == undefined) {
                    myArray.push("No Text");
                }
                resolve(myArray);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })
}

function create(log1, log2, log3, log4, log5) {
    db.Classify.create({
        name: log1,
        summary: log2,
        labels: log3,
        text: log4,
        file: log5
    })
}