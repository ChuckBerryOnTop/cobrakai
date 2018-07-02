const express = require("express");
const bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

var fs = require('fs');

//https
var key = fs.readFileSync('./selfsigned.key');
var cert = fs.readFileSync( './selfsigned.crt' );
//var ca = fs.readFileSync( './mydomain.csr' );

//
var options = {
  key: key,
  cert: cert
  };

var https = require('https');
https.createServer(options, app);


// Requiring our models for syncing
const db = require("./models/index.js");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));


// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
//require("./routes/author-api-routes.js")(app);



// Syncing our sequelize models and then starting our Express app
// =============================================================
// db.sequelize.sync({ force: true }).then(function() {
//     app.listen(PORT, function() {
//       console.log("App listening on PORT " + PORT);
//     });
//   });

db.sequelize.sync({ force: true }).then(function() {
  app.listen(443, function() {
    console.log("App listening on PORT " + PORT);
  });
});
// app.listen(PORT, function() {
//   // Log (server-side) when our server has started
//   console.log("Server listening on: http://localhost:" + PORT);
// });