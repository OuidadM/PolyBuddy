const express = require("express");
const router = express.Router();
const uploadJustificatif = require("../middlewares/uploadJustificatif");
const authController = require("../controllers/auth.controller");

router.post(
  "/register",
  uploadJustificatif.single("justificatif"),
  authController.register
);

router.post(
  "/login",
  authController.login
);

module.exports = router;
