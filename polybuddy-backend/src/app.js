require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend exact
  credentials: true                // cookies / auth
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pour parser les form-data

app.get("/", (req, res) => {
  res.send("App OK, DB sera testée au démarrage du serveur");
});

app.use("/api/auth", authRoutes);

module.exports = app;

