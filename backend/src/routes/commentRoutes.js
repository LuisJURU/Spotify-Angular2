const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Endpoint para obtener comentarios por ID de película
router.get('/comments/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const comments = await Comment.find({ movieId });
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para esta película.' });
    }
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error.message);
    res.status(500).json({ message: 'Error al obtener los comentarios.' });
  }
});

module.exports = router;