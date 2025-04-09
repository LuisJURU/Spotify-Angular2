const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [
    {
      id: String,
      name: String,
      artists: String,
      album: String,
      releaseDate: String,
      imageUrl: String,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);