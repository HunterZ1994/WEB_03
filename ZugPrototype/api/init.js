const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res)=>{
    fs.readFile("./html/index.html", (error, data)=>{
        if(error){
            res.writeHead(400);
            res.write(String(error));
        }else{
            res.writeHead(200, {"content-Type":"text/html"});
            res.write(data);
        }
        res.end();
    });
});

module.exports = router;