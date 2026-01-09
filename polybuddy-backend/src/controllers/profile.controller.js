const User = require("../models/User");
const Student = require("../models/Student");

module.exports = {

  /**
   * GET /profile/me
   */
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: {
          model: Student,
          as: "student"
        }
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Erreur récupération profil" });
    }
  },

  /**
   * PUT /profile/me
   */
  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;

      const {
        prenom,
        nom,
        numero,
        nationalite,
        langue,
        bio
      } = req.body;

      await User.update(
        { prenom, nom, numero, nationalite, langue, bio },
        { where: { id: userId } }
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur mise à jour profil" });
    }
  },

  /**
   * POST /profile/avatar
   */
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier envoyé" });
      }

      await User.update(
        { avatar_url: req.file.path },
        { where: { id: userId } }
      );

      res.json({
        success: true,
        avatarUrl: req.file.path
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur upload avatar" });
    }
  }
};
