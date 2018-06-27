require('../models/logo');

app.post("/api/logo/", (req, res) => {
    console.log(req.body);
    getLogo(req.body);

});