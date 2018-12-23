const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const newGameURL = "http://www.game-engineering.de:8080/rest/schach/spiel/admin/neuesSpiel/";

router.get("/", (req, res, next)=>{
    var gameID = req.query.newGameId;
    var url = newGameURL+gameID;
    request(url, (error, response, data)=>{
        if(error){
             // res.writeHead(400);
            // res.send(String(error));
            next(error);
        }else{
             if(validateXML(String(data))){
                render(req, res, gameID, "Spiel erfolgreich erstellt. Sie Spielen auf ID: ")
             }else{
                render(req, res, gameID, "Fehler beim erstellen des Spiels auf ID: ");
            }
        }
    });
})

function validateXML(data){
    return String(data).includes("D_OK");
}

function render(req, res, gameID, insertion){
    fs.readFile("./html/newGame.html", (error, data)=>{
        if(error){
            res.writeHead(400);
            res.write(error);
        }else{
            res.writeHead(200, {"Content-Type":"text/html"});
            var result = String(data).replace("~", insertion+ gameID);
            res.write(result);
        }
        res.end();
    });
}
module.exports = router;