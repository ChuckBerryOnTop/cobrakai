require('../models/logo');

app.post("/api/logo/id:", (req, res) => {
    console.log(req.body);
    getLogo(req.body);

});