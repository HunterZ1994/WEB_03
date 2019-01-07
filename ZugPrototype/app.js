//requirements
const express = require("express");
const app = express();
const fs = require("fs");



//Routing handler
const init = require("./api/init");
const newGame = require("./api/newGame");
const runningGame = require("./api/renderGame");
const popUp = require("./api/getStatischeBelegung")
const turn = require("./api/ziehe");
const loadGame = require("./api/ladeSpiel");
const save = require("./api/saveGame");



//requesthandler

//Routing Requests
app.use(express.static("./public"));

app.use("/", init);
app.use("/neuesSpiel", newGame);
app.use("/laden", loadGame);
app.use("/render", runningGame);
app.use("/ziehe", turn);
app.use("/speichernSpiel", save);
app.use("/alteBelegung", popUp)



//Exports
module.exports = app;
