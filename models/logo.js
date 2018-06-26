// const dot = require("dotenv").config();
// const request = require("request");
// const express = require("express");

// const router = express.Router();

const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();




  const fileName = './sequelize.svg';

// Performs logo detection on the local file
// client
// .logoDetection(fileName)
// .then(results => {
  
//   if(results[0].logoAnnotations.length < 1 || results[0].logoAnnotations == undefined){
//     console.log("No search results, take a better photo.")
//   }
//   const logos = results[0].logoAnnotations;
//   console.log('Logos:');
//   logos.forEach(logo => console.log(logo));
// })
// .catch(err => {
//   console.error('ERROR:', err);
// });



//2nd method web detetction might be more accurate
client
  .webDetection(fileName)
  .then(results => {
    const webDetection = results[0].webDetection;

    // if (webDetection.fullMatchingImages.length) {
    //   console.log(
    //     `Full matches found: ${webDetection.fullMatchingImages.length}`
    //   );
    //   webDetection.fullMatchingImages.forEach(image => {
    //     console.log(`  URL: ${image.url}`);
    //     console.log(`  Score: ${image.score}`);
    //   });
    // }

    // if (webDetection.partialMatchingImages.length) {
    //   console.log(
    //     `Partial matches found: ${webDetection.partialMatchingImages.length}`
    //   );
    //   webDetection.partialMatchingImages.forEach(image => {
    //     console.log(`  URL: ${image.url}`);
    //     console.log(`  Score: ${image.score}`);
    //   });
    // }

    // if (webDetection.webEntities.length) {
    //   console.log(`Web entities found: ${webDetection.webEntities.length}`);
    //   webDetection.webEntities.forEach(webEntity => {
    //     console.log(`  Description: ${webEntity.description}`);
    //     console.log(`  Score: ${webEntity.score}`);
    //   });
    // }

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