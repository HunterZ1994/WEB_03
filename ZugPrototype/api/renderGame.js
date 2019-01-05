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
const getZugHistorieURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getZugHistorie/";

router.get("/", (req, res) => {
    var requestURL;
    requestURL = getBelegungURL + process.env.gameID;
    request(requestURL, (error, response, body) => {
            if (error) {
                res.writeHead(400);
                res.write(String(error));
                res.end();
            } else {
                var jsonString = JSON.stringify(getFigurenListe(body));
                var FigurID = req.query.ID;
                var ZugHistorie = req.query.zugHistorie;
                var requestURL = getZugHistorieURL + process.env.gameID;
                request(requestURL, (error, response, body) => {
                    if (error) {
                        res.writeHead(400);
                        res.write(String(error));
                        res.end();
                    } else {
                        if (String(body).includes("Keine Zughistorie vorhanden!")) {
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            res.write(renderer.renderPageWithBelegung(jsonString));
                            res.end();
                           console.log("Kein Zug getätigt");
                        } else if(String(body).includes("D_Fehler")){
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            res.write(renderer.renderFailure(jsonString, "Ein Fehler ist aufgetreten"));
                            res.end();
                        }else{
                            var zugHistorie = JSON.stringify(getZugHistorie(String(body)));
                            if (FigurID && FigurID != undefined) {
                                requestURL = getErlaubteZuegeURL + process.env.gameID+"/"+FigurID;
                                request(requestURL, (error, response, body) => {
                                    if (error) {
                                        res.writeHead(400);
                                        res.write(String(error));
                                        res.end();
                                    } else {
                                        res.writeHead(200, {
                                            "Content-Type": "text/html"
                                        });
                                        if(String(body).includes("D_Fehler")){
                                            res.write(renderer.renderFailure(jsonString, "Keine Züge von dieser Position möglich!"));
                                            res.end();
                                        }else{
                                        var position = JSON.stringify(getMöglicheZüge(body));
                                        res.write(renderer.addZugHistorie(jsonString, position, zugHistorie));
                                        res.end();
                                        }
                                    }
                                })
                            } else {
                                res.writeHead(200, {
                                    "Content-Type": "text/html"
                                });
                                res.write(renderer.addZugHistorie(jsonString, null, zugHistorie))
                                res.end();
                            }
                        }
                    }
                })
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
        if (FigurString[3].includes("D_Figur")) {
            weissindex = 4;
        } else {
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
    // console.log(String(xmlString));
    if (String(xmlString).includes("propertiesarray")) {
        var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
        for (var i = 1; i < properties.length; i += 2) {
            var ZugString = properties[i].textContent.split("\n");
            var Zug = {
                endposition: ZugString[2]
            }
            ZugListe.push(Zug);
        }
    } else {
        var pos = xml.getElementsByTagName("entry")[1].textContent;
        var Zug = {
            endposition: pos
        }
        ZugListe.push(Zug);
    }
    return ZugListe;
}

function getZugHistorie(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var ZugListe = new List();
    if (String(xmlString).includes("propertiesarray")) {
        var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
        for (var i = 1; i < properties.length; i += 2) {
            var ZugString = properties[i].textContent.split("\n");
            var Zug = {
                id: (i - 1) / 2,
                zug: ZugString[1]
            }
            // console.log(JSON.stringify(Zug));
            ZugListe.push(Zug);
        }
    } else {
        var entry = xml.getElementsByTagName("entry")[0].textContent;
        var Zug = {
            id: 0,
            zug: entry
        }
        ZugListe.push(Zug);
    }
    return ZugListe;
}

module.exports = router;