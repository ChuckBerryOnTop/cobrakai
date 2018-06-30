const fr = require('face-recognition')

let returnImageObject = {
    faceCount: 0,
    imgUrls: [],
}



module.exports =
{
    detectFaces: function (name = 'image3.png', newObject = true) {
         
        const image = fr.loadImage(name);
        const detector1 = fr.FaceDetector();
        const faceRectangles = detector1.locateFaces(image);

    
        const targetSize = 200;
        const faceImages = detector1.detectFaces(image, targetSize);

        console.log(faceImages);

        if (newObject) {
            returnImageObject.faceCount = 0;
            returnImageObject.imgUrls = [];
        }

        faceImages.forEach((img, i) => {
            returnImageObject.faceCount++;
            let date = new Date();
            let timestamp = date.getTime();
            if (!newObject) {
                returnImageObject.imgUrls.push(`./images/chuckface_${i}${timestamp}.png`);
                fr.saveImage(`./images/chuckface_${i}${timestamp}.png`, img);
            }
            else {
                returnImageObject.imgUrls.push(`./images/chuckface_${i}.png`);
                fr.saveImage(`./images/chuckface_${i}.png`, img);
            }   
        })

        return JSON.stringify(returnImageObject);
        
    },
    toJSON: function() {
        return JSON.parse(JSON.stringify(returnImageObject));
    }

}