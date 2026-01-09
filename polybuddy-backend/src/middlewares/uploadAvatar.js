const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "fill" }]
  }
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 Mo
});

module.exports = uploadAvatar;
