const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// ✅ Upload Controller
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({
        success: true,
        message: `${req.file.originalname} uploaded successfully`,
        filePath: `/uploads/${req.file.filename}`,
    });
};

module.exports = { upload, uploadFile };
