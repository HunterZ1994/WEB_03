const express = require("express");
const router = express.Router();
const request = require("request");

const saveURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/speichernSpiel/"


router.get("/", (req, res) => {
    requestURL =  saveURL + process.env.gameID;
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        }else{
            if(String(body).includes("D_Fehler")){
              console.log("Uuups hier hat etwas nicht funktioniert");
                console.log(String(body));
            }
            res.redirect("/render");
        }
    });
});

module.exports = router;
