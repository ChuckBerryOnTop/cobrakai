
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();  

module.exports = function getLogo(thisFile) {
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
        });
      }
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
  