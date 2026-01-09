const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const uploadAvatar = require("../middlewares/uploadAvatar");

const profileController = require("../controllers/profile.controller");

/**
 * ================================
 * 👤 PROFIL UTILISATEUR CONNECTÉ
 * ================================
 */
router.get(
  "/me",
  authenticate,
  profileController.getMyProfile
);

router.put(
  "/me",
  authenticate,
  profileController.updateMyProfile
);

router.post(
  "/avatar",
  authenticate,
  uploadAvatar.single("avatar"),
  profileController.uploadAvatar
);

module.exports = router;
