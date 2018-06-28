/*
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({ keyFilename: "C:/Users/dankn/Documents/homework/cobrakai/apikey.json" });  //"C:/Users/dankn/Documents/homework/cobrakai/"   "./apikey.json"
let myResult;

module.exports.logo = function (thisFile) {
  //let myResult;
  let fileName = thisFile;
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
          module.exports.myResult = myResult;
          console.log("res1: "+myResult);
        });
       
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}*/
  