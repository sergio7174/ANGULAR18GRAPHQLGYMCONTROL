// src/middleware/uploads.js
// Multer storage configuration
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
   storage: storage,
   fileFilter: function(req, file, callback) {
     if (
       file.mimetype !== "image/png" &&
       file.mimetype !== "image/jpg" &&
       file.mimetype !== "image/jpeg"
     ) {
       return callback(new Error("Only images are allowed"));
     }
     callback(null, true);
   },
   limits: {
     fileSize: 1024 * 1024 * 5
   }
 });
module.exports =  upload ;