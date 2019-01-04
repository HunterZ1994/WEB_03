const express = require("express");
const router = express.Router();
const request = require("request");
const zieheURL = "http://www.game-engineering.de:8080/rest/schach/spiel/ziehe/"

/*erhält von den eingabefeldern von Spielbrett.html von und nach*/

router.get("/", (req, res) => {
    var von = req.query.von;
    var nach = req.query.nach;
    //baut die URL zusammen, die abgeschickt werden soll
    requestURL =  zieheURL + process.env.gameID + "/" + von + "/" + nach;
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        }else{
            if(String(body).includes("D_Fehler")){
              console.log("es war einfehler drin");
                console.log(String(body));
            }
            res.redirect("/render");
        }
    });
});

module.exports = router;
