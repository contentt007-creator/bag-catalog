const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
