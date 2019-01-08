const express = require("express");
const app = express();
const path = require('path');

//routing constants
const init = require("./api/init/index");
const newGame = require("./api/init/newGame");



//Request routing
app.use("/", init);
app.use("/newGame", newGame)

//static CSS and picture files
app.use(express.static(path.join(__dirname, '/public')));

//Error handeling
app.use((req, res, next) =>{
    const error = new Error("Request Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        } 
    });
});

module.exports = app;