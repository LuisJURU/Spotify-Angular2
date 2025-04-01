const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const { getValidSpotifyAccessToken } = require('../utils/spotifyUtils'); // Importa la función para obtener un token válido

const router = express.Router();

// Ruta para buscar canciones y artistas
router.get('/search', authMiddleware, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'El término de búsqueda es obligatorio' });
  }

  try {
    // Obtén un token válido
    const token = await getValidSpotifyAccessToken();

    // Llama a la API de Spotify
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track', // Incluye tanto canciones como artistas
        limit: 50, // Puedes ajustar el límite según tus necesidades
      },
    });

    // Filtra y estructura los datos relevantes
    const tracks = response.data.tracks?.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      releaseDate: track.album.release_date,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      imageUrl: track.album.images[0]?.url,
    })) || [];

    const artists = response.data.artists?.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      imageUrl: artist.images[0]?.url,
    })) || [];

    // Devuelve primero los artistas y luego las canciones
    res.json({ artists, tracks });
  } catch (error) {
    console.error('Error al llamar a la API de música:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener datos de música', details: error.response?.data || error.message });
  }
});

// Ruta para obtener detalles de una canción
router.get('/track/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El ID de la canción es obligatorio' });
  }

  try {
    // Obtén un token válido
    const token = await getValidSpotifyAccessToken();

    // Llama a la API de Spotify para obtener los detalles de la canción
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Estructura los datos relevantes
    const track = {
      id: response.data.id,
      name: response.data.name,
      artists: response.data.artists.map((artist) => artist.name),
      album: {
        name: response.data.album.name,
        release_date: response.data.album.release_date,
        images: response.data.album.images,
      },
      duration_ms: response.data.duration_ms,
      preview_url: response.data.preview_url,
    };

    res.json(track); // Devuelve los datos al frontend
  } catch (error) {
    console.error('Error al obtener los detalles de la canción:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener los detalles de la canción', details: error.response?.data || error.message });
  }
});

// Ruta para obtener la vista previa de una canción
router.get('/preview', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'La URL de la vista previa es obligatoria' });
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error al obtener la vista previa:', error.message);
    res.status(500).json({ error: 'Error al obtener la vista previa' });
  }
});

module.exports = router;