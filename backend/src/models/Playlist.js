const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [
    {
      id: { type: String, unique: true },
      name: String,
      artists: [String], // Cambia a un arreglo de cadenas
      album: String,
      releaseDate: String,
      imageUrl: String,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);