const express = require("express");
const router = express.Router();
const fs = require("fs");
const xmlDom = require("xmldom").DOMParser;
const jsdom = require("jsdom");
const request = require("request");
const List = require("collections/list");
const renderer = require("./renderer");
const {
    JSDOM
} = jsdom;

const getBelegungURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getAktuelleBelegung/";
const getErlaubteZuegeURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getErlaubteZuege/";


router.get("/", (req, res) => {
    var requestURL;
        requestURL = getBelegungURL + process.env.gameID;
    request(requestURL, (error, response, body) => {
            if (error) {
                res.writeHead(400);
                res.write(String(error));
                res.end();
            } else {
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                var jsonString = JSON.stringify(getFigurenListe(body));
                var FigurID = req.query.ID;
                console.log(String(FigurID));
                if (FigurID && FigurID != undefined) {
                    var requestURL = getErlaubteZuegeURL +process.env.gameID+"/"+ FigurID;
                    request(requestURL, (error, response, body) => {
                        if (error) {
                            res.write(String(error));
                            res.end();
                        } else {
                            if (String(body).includes("D_Fehler")) {
                                res.write(renderer.renderFailure(jsonString, "Für diese Figur sind derzeit keine Züge möglich."));
                                res.end();
                            } else {
                                var position = JSON.stringify(getMöglicheZüge(body))
                                res.write(renderer.renderMarked(jsonString, position));
                                res.end();
                            }
                        }
                    })
                } else {
                    res.write(renderer.renderMarked(jsonString));
                    res.end();
                }
            }
        }

    )
})

function getFigurenListe(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
    var FigurenListe = new List();
    var weissindex;
    for (var i = 3; i < properties.length; i += 2) {
        var string = properties[i].textContent;
        var FigurString = string.split("\n");
        if(FigurString[3].includes("D_Figur")){
            weissindex = 4;
        }else{
            weissindex = 3;
        }
        var Figur = {
            position: FigurString[1],
            type: FigurString[2],
            weiss: FigurString[weissindex]
        }
        FigurenListe.push(Figur);
    }
    var bauer = FigurenListe[FigurenListe.length - 1]
    return FigurenListe;
}

function getMöglicheZüge(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var ZugListe = new List();
    if (String(xmlString).includes("propertiesarray")) {
        var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
        for (var i = 1; i < properties.length; i += 2) {
            var ZugString = properties[i].textContent.split("\n");
            var Zug = {
                endposition: ZugString[2]
            }
            ZugListe.push(Zug);
        }
    }else{
        var pos = xml.getElementsByTagName("entry")[1].textContent;
        var Zug = {
            endposition: pos
        }
        ZugListe.push(Zug);
    }
    return ZugListe;
}

module.exports = router;