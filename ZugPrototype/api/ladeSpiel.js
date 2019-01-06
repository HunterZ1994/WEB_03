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




module.exports = router;