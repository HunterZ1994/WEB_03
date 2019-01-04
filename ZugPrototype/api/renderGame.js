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

const getBelegungURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getAktuelleBelegung/5";
const getErlaubteZuegeURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getErlaubteZuege/5/";


router.get("/", (req, res) => {
    var requestURL;
    if (getBelegungURL.length <= 74) {
        requestURL = getBelegungURL + process.env.gameID;
    } else {
        requestURL = getBelegungURL
    }
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
                if(FigurID && FigurID!=undefined){
                    var requestURL = getErlaubteZuegeURL +FigurID;
                    request(requestURL, (error, response, body)=>{
                        if(error){
                            res.write(String(error));
                            res.end();
                        }else{
                            if(String(body).includes("D_Fehler")){
                                res.write(renderer.renderFailure(jsonString, "Für diese Figur sind derzeit keine Züge möglich."));
                                res.end();
                            }else{
                            var position = JSON.stringify(getMöglicheZüge(body))
                            res.write(renderer.renderMarked(jsonString, position));
                            res.end();
                            }
                        }
                    })
                }else{
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
    for (var i = 3; i < properties.length; i += 2) {
        var string = properties[i].textContent;
        var FigurString = string.split("\n", 4);
        var Figur = {
            position: FigurString[1],
            type: FigurString[2],
            weiss: FigurString[3]
        }
        FigurenListe.push(Figur);
    }
    var bauer = FigurenListe[FigurenListe.length - 1]
    return FigurenListe;
}

function getMöglicheZüge(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
    var ZugListe = new List();
    for (var i = 1; i < properties.length; i += 2) {
        var ZugString = properties[i].textContent.split("\n");
        var Zug = {
            endposition: ZugString[2]
        }
        ZugListe.push(Zug);
    }
    return ZugListe;
}

module.exports = router;
