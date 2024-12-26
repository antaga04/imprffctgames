const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gameshub',
    allowFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  },
});

const uploadFile = multer({ storage });

//! Create delete file

module.exports = uploadFile;
