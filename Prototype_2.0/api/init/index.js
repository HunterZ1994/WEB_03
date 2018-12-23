const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res, next)=>{
    fs.readFile("./html/index.html", (error, data)=>{
        if(error){
            res.status(404);
            res.send("File not found");
        }else{
            res.writeHead(200, {"Content-Type":"text/html"});
            res.write(data);
        }
        res.end();
    })
});

module.exports = router;