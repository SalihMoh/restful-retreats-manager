
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for storing uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (req.file) {
        const filePath = `/uploads/${req.file.filename}`;
        req.body.image = filePath;
      }
      
      if (req.body.amenities) {
        try {
          req.body.amenities = JSON.parse(req.body.amenities);
        } catch (e) {
          console.error('Error parsing amenities:', e);
        }
      }
      
      next();
    });
  } else {
    next();
  }
};
