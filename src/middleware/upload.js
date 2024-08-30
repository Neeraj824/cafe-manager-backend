const multer = require('multer');
const path = require('path');

// Set up the storage destination and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
  }
});

// File filter to allow only image files (e.g., jpg, png)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 } // Limit file size to 5MB
});

module.exports = upload;