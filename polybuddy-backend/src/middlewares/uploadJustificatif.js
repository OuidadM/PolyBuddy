const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "justificatifs",           
    allowed_formats: ["pdf", "png", "jpg", "jpeg"],
    resource_type: "auto",        
  },
});

const uploadJustificatif = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
});

module.exports = uploadJustificatif;
