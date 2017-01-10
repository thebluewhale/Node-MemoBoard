var express = require("express");
var router  = express.Router();

// Router for home
router.get("/", function(req, res){
  res.render("main/home");
});

module.exports = router;
