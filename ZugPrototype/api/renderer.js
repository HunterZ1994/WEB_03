const fs = require("fs");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const request = require("request");
const Readable = require("stream").Readable;
const Writable = require("stream").Writable;


module.exports = {
    renderPureHTML,
    renderPageWithBelegung,
    renderMarked,
    renderFailure,
    addZugHistorie
}

function renderPureHTML() {
    var data = fs.readFileSync("./html/spielbrett.html");
    return data;
}

function renderPageWithBelegung(JSONString) {
    var data = fs.readFileSync("./html/spielbrett.html");
    var dom = new JSDOM(data);
    var json = JSON.parse(JSONString);
    for (var i = 0; i < json.length; i++) {
        var position = JSON.stringify(json[i].position).replace("\"", "").replace("\\r\"", "");
        // console.log("Position: "+position);
        if (position.length > 1) {
            img = "<img src=" + getAssociatedFigure(JSON.stringify(json[i])) + " alt =\"" + position + "\" height=\"50\" width=\"50\">"
            dom.window.document.getElementById(String(position)).innerHTML = img;
        }
    }
    return dom.serialize();
}

function getAssociatedFigure(JSONString) {
    var json = JSON.parse(JSONString);
    var figur = JSON.stringify(json.type).replace("\\r\"", "").replace("\"", "");
    var weiss = JSON.stringify(json.weiss).replace("\\r\"", "").replace("\"", "");
    var file = "./img/";
    file += figur.charAt(0);
    file += "_";
    if (weiss == "false") {
        file += "S.png";
    } else {
        file += "W.png";
    }
    return "\"./" + file + "\"";
}
//Render Spielfeld mit aktueller Belegung und den hervorgehobenen Feldern.
function renderMarked(jsonString, position) {
    var gameData = renderPageWithBelegung(jsonString);
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
    dom.window.document.head.insertAdjacentHTML("beforeend", "<script>alert('" + alertMessage + "')</script>");
    return dom.serialize();
}

function addZugHistorie(JSONString, position, zugHistorie) {
    var gameData = renderMarked(JSONString, position);
    var dom = new JSDOM(gameData);
    if (zugHistorie) {
        var json = JSON.parse(zugHistorie);
        if (json.length > 1) {
            for (var i = 0; i < json.length; i++) {
                var id = JSON.stringify(json[i].id).replace("\"", "").replace("\\r\"", "");
                var zug = JSON.stringify(json[i].zug).replace("\"", "").replace("\\r\"", "");
                // console.log(i +" "+ id +" "+ zug);
                dom.window.document.getElementById("zugHistorie").insertAdjacentHTML("beforeend", "<p id=\"" + id + "\">" + zug + "</p>");
            }
        } else {
            var id = JSON.stringify(json[0].id).replace("\"", "").replace("\\r\"", "");
            var zug = JSON.stringify(json[0].zug).replace("\"", "").replace("\\r\"", "");
            dom.window.document.getElementById("zugHistorie").insertAdjacentHTML("beforeend", "<p id=\"" + id + "\">" + zug + "</p>");
        }
    }
    return dom.serialize();
}