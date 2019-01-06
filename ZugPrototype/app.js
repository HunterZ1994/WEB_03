//requirements
const express = require("express");
const app = express();



//Request handler
const init = require("./api/init");
const newGame = require("./api/Game");
const runningGame = require("./api/renderGame");
const turn = require("./api/ziehe");
const loadGame = require("./api/ladeSpiel");
const save = require("./api/saveGame");



//Routing Requests
app.use(express.static("./public"));

app.use("/", init);
app.use("/neuesSpiel", newGame);
app.use("/laden", loadGame);
app.use("/render", runningGame);
app.use("/ziehe", turn);
app.use("/speichernSpiel", save);


//Exports
module.exports = app;
