const express = require("express");
const router = express.Router();
const request = require("request");
const zieheURL = "http://www.game-engineering.de:8080/rest/schach/spiel/ziehe/"

router.get("/", (req, res) => {
    var von = req.query.von;
    var nach = req.query.nach;
    requestURL =  zieheURL + process.env.gameID + "/" + von + "/" + nach;
    console.log(requestURL);
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        }else{
            if(String(body).includes("D_Fehler")){
                console.log(String(body));
            }
            res.redirect("/render");
        }
    });
});

module.exports = router;