const express = require("express");
const router = express.Router();
const request = require("request");
const zieheURL = "http://www.game-engineering.de:8080/rest/schach/spiel/ziehe/"

/*erhält von den eingabefeldern von Spielbrett.html von und nach*/

router.get("/", (req, res) => {   //es geht mit "/", die vorige URL ist schon "drin"
    var von = req.query.von;    //kommen nach '?'
    var nach = req.query.nach;
    //baut die URL zusammen, die abgeschickt werden soll
    requestURL =  zieheURL + process.env.gameID + "/" + von + "/" + nach;
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        }else{
            if(String(body).includes("D_Fehler")){
              console.log("es war ein Fehler drin");
              console.log(String(body));
            }else if(String(body).includes("Sie sind nicht am Zug!")){
                res.write("Sie sind nicht am Zug");
                res.end();
            }
            process.env.anzeige = "anzeigen";
            res.redirect("/render");
        }
    });
});

module.exports = router;  //router ist unterklasse von app
