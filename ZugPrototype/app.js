//requirements
const express = require("express");
const app = express();

//Routing handler
const init = require("./api/init");

//Routing Requests
app.use("/", init);

//Exports
module.exports = app;