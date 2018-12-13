const
    express = require('express'),
    router = express.Router(),
    request = require("request"),
    parseString = require("xml2js").parseString;

/* GET users listing. */
router.route('/neuesSpiel/:id')
    .get((req, res, next) => {        
//Parse XML to JSON
        request(`http://www.game-engineering.de:8080/rest/schach/spiel/admin/neuesSpiel/${req.params.id}`, (err, resp, body) => {
            parseString(body, (error, result) => {
            if (error) {
                console.log("ERRRROR: " + error);
                return;
            }
            // get success message
            res.json(result.properties.entry[0]._)
        });
    });
});

module.exports = router;