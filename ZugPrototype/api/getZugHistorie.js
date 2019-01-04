const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const xmlDom = require("xmldom").DOMParser;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const List = require("collections/list");

const getZugHistorieURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getZugHistorie/"

router.get("/", (req, res) => {

    requestURL = getZugHistorieURL + process.env.gameID;
  //  requestURL = getZugHistorieURL + 5;
    console.log(requestURL);
    request(requestURL, (error, response, body) => {

      console.log("Die Zughistorie:");
      console.log(String(body));

        /*if (error) {
            res.writeHead(200);
            res.write(String(error));
        } else {
            if (String(body).includes("D_ZugHistorie")) {
                res.redirect("/render");
                res.end();
            } else {
                res.writeHead(400, {
                    "Content-Type": "text/html"
                });
                res.write("Fehler bei Zughistorie anzeigen");
                console.log("Fehler bei Zughistorie anzeigen");
                res.end();
            }
        }*/
    })
});

module.exports = router;
