const express = require("express");
const router = express.Router();
const request = require("request");

var newGameURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/neuesSpiel/";

router.get("/", (req, res) => {
    if (!process.env.gameID || process.env.gameID == undefined) {
        process.env.gameID = req.query.neuesSpielID;
    }
    requestURL = newGameURL + process.env.gameID;
    request(requestURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        } else {
            if (String(body).includes("D_OK")) {
                res.redirect("/render"); //renderGame     die URL wird geändert, dadurch leitet app.js weiter
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

module.exports = router
