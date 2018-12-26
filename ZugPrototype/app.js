//requirements
const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");

//logging
app.use(morgan('common', {stream: fs.createWriteStream('./requests.log', {flags: 'a'})}));

//Routing handler
const init = require("./api/init");
const newGame = require("./api/Game");


//Routing Requests
app.use(express.static("./public/img/"));
app.use("/", init);
app.use("/neuesSpiel", newGame);

//Exports
module.exports = app;