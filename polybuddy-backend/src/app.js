require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("App OK, DB sera testée au démarrage du serveur");
});

module.exports = app;
