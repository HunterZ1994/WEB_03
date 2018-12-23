//requirements
const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");

//logging
app.use(morgan('common', {stream: fs.createWriteStream('./requests.log', {flags: 'a'})}));

//Routing handler
const init = require("./api/init");

//Routing Requests
app.use("/", init);

//Exports
module.exports = app;