const express = require("express");
const router = express.Router();

router.get("/", (req, res, next)=>{
    var id = req.query.hiddenID;
    res.send("testfile called" + id);
});

module.exports = router;