const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  movieId: { type: String, required: true }, // ID de la película
  rating: { type: Number, required: true }, // Calificación del usuario
  comment: { type: String, required: false }, // Comentario del usuario
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

module.exports = mongoose.model('Comment', CommentSchema);