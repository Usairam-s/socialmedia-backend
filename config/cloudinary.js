const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Social_Media_Backend",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
