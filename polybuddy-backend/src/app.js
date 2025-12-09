require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App OK, DB sera testée au démarrage du serveur");
});

app.use("/api/auth", authRoutes);

module.exports = app;

