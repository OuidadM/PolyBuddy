const express = require("express");
const router = express.Router();
const uploadJustificatif = require("../middlewares/uploadJustificatif");
const authController = require("../controllers/auth.controller");

const { authenticate } = require("../middlewares/auth.middleware");

// Routes publiques
router.post(
  "/register",
  uploadJustificatif.single("justificatif"),
  authController.register
);

router.post(
  "/register/admin",
  authController.registerAdmin 
);

router.post(
  "/login",
  authController.login
);

router.get(
  "/me",
  authenticate, // ← Middleware qui vérifie le JWT
  authController.me
);

router.post(
  "/logout",
  authController.logout
);

module.exports = router;