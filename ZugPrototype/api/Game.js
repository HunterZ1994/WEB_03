const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const xmlDom = require("xmldom").DOMParser;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const List = require("collections/list");


var newGameURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/neuesSpiel/";

router.get("/", (req, res) => {
    if(!process.env.gameID || process.env.gameID == undefined){
    process.env.gameID = req.query.neuesSpielID;
    }
    requestURL = newGameURL + process.env.gameID;
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        } else {
            if (String(body).includes("D_OK")) {
                res.redirect("/render");    //renderGame
                console.log("Spiel erfolgreich erstellt.");
                res.end();
            } else {
                res.writeHead(400, {
                    "Content-Type": "text/html"
                });
                res.write("Fehler beim Erstellen des Spiels");
                console.log("Fehler beim Erstellen des Spiels");
                res.end();
            }
        }
    })
});


function getGeschlageneFiguren(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
    var geschlageneListe = new List();
    var geschlageneString = String(properties[1].textContent).split("\n");
    console.log("***Die geschlagenenFiguren***");
    console.log(geschlageneString);
    var Geschlagene = {
        anzahlGeschlageneFiguren: geschlageneString[1],
        status: geschlageneString[2],
        nach: geschlageneString[3],
        von: geschlageneString[4],
        bemerkung: geschlageneString[5],
        anzahlFigurenAufBrett: geschlageneString[6]
    }
    geschlageneListe.push(Geschlagene);
    return geschlageneListe;
}

module.exports = router
