const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const xmlDom = require("xmldom").DOMParser;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const List = require("collections/list");


const newGameURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/neuesSpiel/5";
const getBelegungURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getAktuelleBelegung/5";

router.get("/", (req, res) => {
    request(newGameURL, (error, response, body) => {
        if (error) {
            res.writeHead(200);
            res.write(String(error));
        } else {
            if (String(body).includes("D_OK")) {
                renderBrett(req, res);
            } else {
                res.writeHead(400, {
                    "Content-Type": "text/html"
                });
                res.write("Fehler beim Erstellen des Spiels");
                res.end();
            }
        }
    })
});

function renderBrett(req, res) {
    request(getBelegungURL, (error, response, body) => {
        if (error) {
            res.writeHead(400);
            res.write(String(error));
            res.end();
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            //   res.write(JSON.stringify(getGeschlageneFiguren(body)));
            // fs.writeFileSync("testdata.json", JSON.stringify(getFigurenListe(body)));
            var jsonString = JSON.stringify(getFigurenListe(body));
            var data = fs.readFileSync("./html/spielbrett.html");
            var result = manipulateResponse(jsonString, data);
            // console.log(result);
            res.write(result);            
            res.end();
        }
    });
}


function getGeschlageneFiguren(xmlString) {
    var xml = new xmlDom().parseFromString(String(xmlString));
    var properties = xml.getElementsByTagName("propertiesarray")[0].childNodes;
    var geschlageneListe = new List();
    var geschlageneString = String(properties[1].textContent).split("\n");
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
    return FigurenListe;
}

function manipulateResponse(jsonString, filedata){
    var json  = JSON.parse(jsonString);
    var dom = new JSDOM(filedata);
    for(var i=0; i<json.length; i++){
        var position = JSON.stringify(json[i].position).replace("\"", "").replace("\\r\"", "");
        // var img = dom.window.document.createElement("img");
        // img.src=getAssociatedFigure(JSON.stringify(json[i]))
        img = "<img src="+getAssociatedFigure(JSON.stringify(json[i]))+" alt=\""+position+"\" height=\"50\" width=\"50\">"
        // console.log(img);
        dom.window.document.getElementById(String(position)).innerHTML = img;
    }
    // console.log(dom.serialize());
    return dom.serialize();
}

function getAssociatedFigure(JSONString){
    var json = JSON.parse(JSONString);
    var figur = JSON.stringify(json.type).replace("\\r\"", "").replace("\"", "");
    var weiss = JSON.stringify(json.weiss).replace("\\r\"", "").replace("\"", "");
    var file = "";
    file += figur.charAt(0);
    file+="_";
    if(weiss=="false"){
        file+="S.png";
    }else{
        file+="W.png";
    }
    return "\"./"+file+"\"";
}

module.exports = router