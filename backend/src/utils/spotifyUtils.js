const axios = require('axios');

// Función para obtener el token de acceso de Spotify
const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Guarda el token en una variable de entorno
    process.env.SPOTIFY_ACCESS_TOKEN = response.data.access_token;
    console.log('Nuevo token de Spotify obtenido:', response.data.access_token);
  } catch (error) {
    console.error('Error al obtener el token de Spotify:', error.response?.data || error.message);
    throw new Error('No se pudo obtener el token de Spotify');
  }
};

module.exports = { getSpotifyAccessToken };