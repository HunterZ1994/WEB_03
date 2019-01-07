const express = require("express");
const router = express.Router();
const xmlDom = require("xmldom").DOMParser;
const request = require("request");
const List = require("collections/list");
const renderer = require("./renderer");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

const staticBelegungURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getBelegung/";

router.get("/", (req, res)=>{
    requestURL = staticBelegungURL + process.env.gameID+ "/"+req.query.zugNummer;
    request(requestURL, (error, response, body)=>{
        if(error){
            res.writeHead(400);
            res.write(error);
            res.end();
        }else{
            var jsonString = JSON.stringify(getFigurenListe(body));
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(renderer.renderPageWithBelegungStatic(jsonString));
            res.end();
        }
    });
});


function getFigurenListe(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
    var FigurenListe = new List();
    var weissindex;

    for (var i = 3; i < properties.length; i += 2) { //weil jedes zweite property leer ist
        var string = properties[i].textContent;
        var FigurString = string.split("\n");
        if (FigurString[3].includes("D_Figur")) {
            weissindex = 4; //bei laden ist farbe auf 4
        } else {
            weissindex = 3; //bei neues spiel auf 3
        }
        var Figur = {
            position: FigurString[1],
            type: FigurString[2],
            weiss: FigurString[weissindex]
        }
        FigurenListe.push(Figur);
    }

    return FigurenListe;
}
module.exports = router;