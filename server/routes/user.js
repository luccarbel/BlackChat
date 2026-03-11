const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Crear usuario anónimo
router.post('/create', async (req, res) => {
  try {
    const user = new User({
      anonymousId: uuidv4(),
      username: `User_${Math.floor(Math.random() * 100000)}`
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por ID anónimo
router.get('/:anonymousId', async (req, res) => {
  try {
    const user = await User.findOne({ anonymousId: req.params.anonymousId });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar avatar del usuario
router.put('/:anonymousId/avatar', async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const user = await User.findOneAndUpdate(
      { anonymousId: req.params.anonymousId },
      { avatar: avatarUrl },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
