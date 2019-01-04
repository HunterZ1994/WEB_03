const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const xmlDom = require("xmldom").DOMParser;
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const List = require("collections/list");


var loadGameURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/ladenSpiel/";


router.get("/", (req, res) => {
    process.env.gameID = req.query.ladenSpielID;
    reqURL = loadGameURL + process.env.gameID;
    request(reqURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        } else {
            if (String(body).includes("D_OK")) {
                res.redirect("/render"); //renderGame
                console.log("Spiel erfolgreich geladen.");
                res.end();
            } else {
                res.writeHead(400, {
                    "Content-Type": "text/html"
                });
                res.write("Fehler beim Laden des Spiels");
                console.log("Fehler beim Laden des Spiels");
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
    console.log("Die geschlagenenFiguren");
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

module.exports = router;