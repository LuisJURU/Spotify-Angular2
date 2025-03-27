const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const { getSpotifyAccessToken } = require('../utils/spotifyUtils'); // Importa la función para obtener el token

const router = express.Router();

// Ruta para obtener datos de música
router.get('/search', authMiddleware, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'El término de búsqueda es obligatorio' });
  }

  try {
    // Verifica si el token está disponible, si no, obtén uno nuevo
    if (!process.env.SPOTIFY_ACCESS_TOKEN) {
      await getSpotifyAccessToken();
    }

    // Llama a la API de Spotify
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
      },
      params: {
        q: query,
        type: 'track',
        // limit: 10,
        limit: 50,
        offset: 50,
      },
    });

    // Filtra y estructura los datos relevantes
    const tracks = response.data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      releaseDate: track.album.release_date,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      imageUrl: track.album.images[0]?.url,
    }));

    res.json(tracks); // Devuelve solo los datos relevantes al frontend
  } catch (error) {
    console.error('Error al llamar a la API de música:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener datos de música', details: error.response?.data || error.message });
  }
});

module.exports = router;