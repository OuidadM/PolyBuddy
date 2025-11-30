const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route OK");
});

module.exports = router;
