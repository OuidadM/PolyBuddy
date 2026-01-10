const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Address = require("../models/Address");

module.exports = {

  /**
   * GET /profile/me
   */
  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: [
          { model: Address, as: "address" },
          {
            model: Student,
            as: "student",
            include: [
              { model: Alumni, as: "alumni" }
            ]
          }
        ]
      });


      res.json(user);
    } catch (error) {
      console.log("error : ",error);
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
        username,
        numero,
        nationalite,
        langue,
        bio,
        address,
        student
        } = req.body;
        console.log("userame in : ",req.body);
        /** ================= USER ================= */
        await User.update(
        { prenom, nom,login:username, numero, nationalite, langue, bio },
        { where: { id: userId } }
        );

        /** ================= ADDRESS ================= */
        if (address) {
        const user = await User.findByPk(userId);
        
        if (user.addressId) {
            await Address.update(address, {
            where: { id: user.addressId }
            });
        } else {
            const newAddress = await Address.create(address);
            await user.update({ addressId: newAddress.id });
        }
        }

        /** ================= STUDENT ================= */
        if (student) {
          await Student.update(student, {
            where: { id: userId } // IMPORTANT
          });
        }

        if (student?.alumni) {
          await Alumni.update(student.alumni, {
            where: { id: userId }
          });
        }


        res.json({ success: true });

    } catch (error) {
        console.error(error);
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
