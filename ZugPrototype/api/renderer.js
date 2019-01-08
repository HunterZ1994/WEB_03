const fs = require("fs");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

module.exports = {
    renderPageWithBelegung,
    renderPageWithBelegungStatic,
    renderMarked,
    renderFailure,
    addZugHistorie,
    sieg
}

//JSONString ist Liste der aktuelle Belegung des Schachbretts in JSON Format, kommt von getFigurenListe



function renderPageWithBelegung(JSONString) {
    var data = fs.readFileSync("./html/spielbrett.html");
    var dom = new JSDOM(data);    //erzeugt einen DOM Baum und speichert ihn
    var json = JSON.parse(JSONString);
    for (var i = 0; i < json.length; i++) {
        var position = JSON.stringify(json[i].position).replace("\"", "").replace("\\r\"", "");
        if (position.length > 1) {
            img = "<img src=" + getAssociatedFigure(JSON.stringify(json[i])) + " alt =\"" + position + "\" height=\"50\" width=\"50\">"
            dom.window.document.getElementById(String(position)).innerHTML = img;
        }
    }

    return dom.serialize(); //gibt html als string zurück
}

function renderPageWithBelegungStatic(JSONString){
    var data = fs.readFileSync("./html/staticSpielbrett.html");
    var dom = new JSDOM(data);    //erzeugt einen DOM Baum und speichert ihn
    var json = JSON.parse(JSONString);
    for (var i = 0; i < json.length; i++) {
        var position = JSON.stringify(json[i].position).replace("\"", "").replace("\\r\"", "");
        if (position.length > 1) {
            img = "<img src=" + getAssociatedFigure(JSON.stringify(json[i])) + " alt =\"" + position + "\" height=\"50\" width=\"50\">"
            dom.window.document.getElementById(String(position)).innerHTML = img;
        }
    }

    return dom.serialize(); //gibt html als string zurück
}

function getAssociatedFigure(JSONStringEinerFigur) {
    var json = JSON.parse(JSONStringEinerFigur);
    var figurtyp = JSON.stringify(json.type).replace("\\r\"", "").replace("\"", "");   //stringify macht einen JSON-String
    var weiss = JSON.stringify(json.weiss).replace("\\r\"", "").replace("\"", "");
    var file = "img/";
    file += figurtyp.charAt(0);
    file += "_";
    if (weiss == "false") {
        file += "S.png";
    } else {
        file += "W.png";
    }
    return "\"/" + file + "\"";
}
//Render Spielfeld mit aktueller Belegung und den hervorgehobenen Feldern.
function renderMarked(jsonString, position, alertMessage) {
    var gameData = renderFailure(jsonString, alertMessage); //gamedata ist eine html-datei, die das schachfeld mit figuren drauf enthält
    var dom = new JSDOM(gameData);
    if (position) {
        var json = JSON.parse(position);
        if (json.length > 1) {
            for (var i = 0; i < json.length; i++) {
                var endposition = JSON.stringify(json[i].endposition).replace("\"", "").replace("\\r\"", "");
                dom.window.document.getElementById(String(endposition)).style.borderColor = "red";
                dom.window.document.getElementById(String(endposition)).style.borderWidth = "5px";
            }
        } else {
            var endposition = JSON.stringify(json[0].endposition).replace("\"", "").replace("\"", "");
            dom.window.document.getElementById(String(endposition)).style.borderColor = "red";
            dom.window.document.getElementById(String(endposition)).style.borderWidth = "5px";
        }
    }
    return dom.serialize();
}

function renderFailure(JSONString, alertMessage) {
    var data = renderPageWithBelegung(JSONString);
    var dom = new JSDOM(data);
    if (alertMessage) {
        dom.window.document.head.insertAdjacentHTML("beforeend", "<script>alert('" + alertMessage + "')</script>");
        dom.window.document.head.insertAdjacentHTML("beforeend", "<script>window.location='/render'</script>");
    }
    return dom.serialize();
}

function addZugHistorie(JSONString, position, zugHistorie, alertMessage) {

    var json = JSON.parse(zugHistorie);
    var gameData = renderMarked(JSONString, position, alertMessage);
    var dom = new JSDOM(gameData);
    // if (!(String(zugHistorie).includes("Keine Zughistorie vorhanden!") || (json.length % 2) == 0)) {
    //     dom.window.document.getElementsByTagName("table")[0].style.transform = "rotate(180deg)";
    //     for(var i=0; i<dom.window.document.getElementsByTagName("th").length; i++){
    //         dom.window.document.getElementsByTagName("th")[i].style.transform = "rotate(180deg)";
    //     }
    //     for(var i=0; i<dom.window.document.getElementsByTagName("td").length; i++){
    //         dom.window.document.getElementsByTagName("td")[i].style.transform = "rotate(180deg)";
    //     }
    // }

    if (!(String(zugHistorie).includes("Keine Zughistorie vorhanden!") || (json.length % 2) == 0)) {
        dom.window.document.getElementById("Spieler").innerHTML = "Schwarz ist am Zug";
    }else{
        dom.window.document.getElementById("Spieler").innerHTML = "Weiss ist am Zug";
    }
    if (json.length > 1) {
        for (var i = 0; i < json.length; i++) {
            var id = JSON.stringify(json[i].id).replace("\"", "").replace("\\r\"", "");
            var zug = JSON.stringify(json[i].zug).replace("\"", "").replace("\\r\"", "");
            dom.window.document.getElementById("zugHistorie").insertAdjacentHTML("beforeend", "<p id=\"" + id + "\" onclick='openStaticoccupancy(id)'>" + zug + "</p>");
        }
    } else {
        var id = JSON.stringify(json[0].id).replace("\"", "").replace("\\r\"", "");
        var zug = JSON.stringify(json[0].zug).replace("\"", "").replace("\\r\"", "");
        dom.window.document.getElementById("zugHistorie").insertAdjacentHTML("beforeend", "<p id=\"" + id + "\" onclick='openStaticoccupancy(id)'>" + zug + "</p>");
    }

    return dom.serialize();     //macht aus dom einen HTML-String
}

function sieg(Spieler){
    var data = fs.readFileSync("./html/Sieg.html");
    var dom = new JSDOM(data);
    dom.window.document.getElementsByTagName("div")[0].innerHTML = Spieler + " hat gewonnen.\n Herzlichen Glückwunsch!"
    return dom.serialize();
}
