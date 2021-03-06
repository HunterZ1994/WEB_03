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

//benutzt renderer.js als bibliothek
const getBelegungURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getAktuelleBelegung/";
const getErlaubteZuegeURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getErlaubteZuege/";
const getZugHistorieURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getZugHistorie/";
const getSpielDaten = "http://www.game-engineering.de:8080/rest/schach/spiel/getSpielDaten/";

router.get("/", (req, res) => {
    var requestURL;
    requestURL = getBelegungURL + process.env.gameID;
    //holt sich alle nötigen DAten vom Server und zeigt das Spielbrett beim Client an
    request(requestURL, (error, response, body) => { //body ist das was auf der Seite angezeigt wird
            if (error) {
                res.writeHead(400);
                res.write(String(error));
                res.end();
            } else {
                var jsonString = JSON.stringify(getFigurenListe(body));
                var FigurID = req.query.ID; //in der URL sind die query parameter mit '?'
                var EndPosition = req.query.EndPosition; //wo die figur hinziehensoll
                var requestURL = getZugHistorieURL + process.env.gameID;
                request(requestURL, (error, response, body) => {
                    if (error) {
                        res.writeHead(400);
                        res.write(String(error));
                        res.end();
                    } else {
                        if (String(body).includes("D_Fehler") && !String(body).includes("Keine Zughistorie vorhanden!")) {
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            res.write(renderer.renderFailure(jsonString, "Ein Fehler ist aufgetreten"));
                            res.end();
                        } else {
                            var zugHistorie = JSON.stringify(getZugHistorie(String(body)));
                            var requestURL = getSpielDaten + process.env.gameID;
                            request(requestURL, (error, response, body) => {
                                if (error) {
                                    res.writeHead(400);
                                    res.write(String(error));
                                    res.end();
                                } else if (String(body).includes("Schach") && (process.env.anzeige == "anzeigen") ) {
                                    if(String(body).includes("WeissImSchach")){
                                        process.env.anzeige = "nicht anzeigen"
                                        res.write(renderer.addZugHistorie(jsonString, null, zugHistorie, "Weiss steht im Schach"));
                                        res.end();
                                    }else if(String(body).includes("SchwarzImSchach")){
                                        process.env.anzeige = "nicht anzeigen"
                                        res.write(renderer.addZugHistorie(jsonString, null, zugHistorie, "Schwarz steht im Schach"));
                                        res.end();
                                    }else if(String(body).includes("WeissSchachMatt")){
                                        process.env.anzeige = "nicht anzeigen"
                                        res.write(renderer.sieg("Schwarz"));
                                        res.end();
                                    }else if(String(body).includes("SchwarzSchachMatt")){
                                        process.env.anzeige = "nicht anzeigen"
                                        res.write(renderer.sieg("Weiss"));
                                        res.end();
                                    }else{
                                        process.env.anzeige = "nicht anzeigen"
                                        res.redirect("/render");
                                    }
                                } else {
                                    if (FigurID && (FigurID != undefined)) {
                                        requestURL = getErlaubteZuegeURL + process.env.gameID + "/" + FigurID;
                                        request(requestURL, (error, response, body) => {
                                            if (error) {
                                                res.writeHead(400);
                                                res.write(String(error));
                                                res.end();
                                            } else {
                                                if (String(body).includes("Keine Zuege erlaubt von diesem Feld!")) {
                                                    res.writeHead(200, {
                                                        "Content-Type": "text/html"
                                                    });
                                                    res.write(renderer.addZugHistorie(jsonString, null, zugHistorie, "Keine Züge von dieser Position möglich!"));
                                                    res.end();
                                                } else {

                                                    if (EndPosition && EndPosition != undefined) {
                                                        res.redirect("/ziehe/?von=" + FigurID + "&nach=" + EndPosition);
                                                    } else {
                                                        res.writeHead(200, {
                                                            "Content-Type": "text/html"
                                                        });

                                                        var position = JSON.stringify(getMöglicheZüge(body));
                                                        res.write(renderer.addZugHistorie(jsonString, position, zugHistorie));
                                                        res.end();
                                                    }
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
                            });
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
                id: (i - 1) / 2, //jeden zweiten property
                zug: ZugString[1]
            }
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