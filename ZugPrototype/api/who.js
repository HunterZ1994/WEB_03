const express = require("express");
const router = express.Router();


const zugHistorieURL = "http://www.game-engineering.de:8080/rest/schach/spiel/getZugHistorie/";

router.get("/", (req, res) => {
    requestURL = zugHistorieURL + process.env.gameID;
    console.log("Request URL from whois: " + requestURL);
    res.redirect("/render");
});


module.exports = router;