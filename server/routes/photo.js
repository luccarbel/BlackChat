const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para guardar fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se aceptan archivos de imagen'), false);
    }
  },
  limits: { fileSize: 5242880 } // 5MB
});

// Subir foto
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { userId, caption, tags } = req.body;
    const photo = new Photo({
      userId,
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      caption,
      tags: tags ? JSON.parse(tags) : []
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las fotos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener foto por ID
router.get('/:photoId', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a una foto
router.post('/:photoId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    
    if (!photo.likedBy.includes(userId)) {
      photo.likedBy.push(userId);
      photo.likes += 1;
    }
    
    await photo.save();
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comentar en una foto
router.post('/:photoId/comment', async (req, res) => {
  try {
    const { userId, username, text } = req.body;
    const photo = await Photo.findByIdAndUpdate(
      req.params.photoId,
      {
        $push: {
          comments: {
            userId,
            username,
            text,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
