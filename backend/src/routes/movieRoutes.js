const express = require('express');
const Comment = require('../models/Comment');

const {
  getPopularMovies,
  getNewMovies,
  getFeaturedMovies,
  searchMovies,
  getMovieDetails,
  getBestMoviesOfMonth,
  getCategories,
  getMoviesByCategory,
  rateMovie
} = require('../services/movieService');

const router = express.Router();

// Endpoint para obtener películas populares
router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const movies = await getPopularMovies(page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las películas populares' });
  }
});

// Endpoint para obtener películas nuevas
router.get('/new', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const movies = await getNewMovies(page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las películas nuevas' });
  }
});

// Endpoint para obtener películas destacadas
router.get('/featured', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const movies = await getFeaturedMovies(page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las películas destacadas' });
  }
});

// Endpoint para buscar películas
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const movies = await searchMovies(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar películas' });
  }
});

// Endpoint para obtener detalles de una película
router.get('/details/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await getMovieDetails(movieId);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los detalles de la película' });
  }
});

// Endpoint para obtener las mejores películas del mes
router.get('/best', async (req, res) => {
  try {
    const movies = await getBestMoviesOfMonth();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las mejores películas del mes' });
  }
});

// Endpoint para obtener categorías
router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
});

// Endpoint para obtener películas por categoría
router.get('/category/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const page = req.query.page || 1;
    const movies = await getMoviesByCategory(categoryId, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las películas por categoría' });
  }
});

// Endpoint para guardar comentarios y calificaciones
router.post('/rate', async (req, res) => {
  const { movieId, rating, comment } = req.body;

  if (!movieId || !rating) {
    return res.status(400).json({ message: 'El ID de la película y la calificación son obligatorios.' });
  }

  try {
    const newComment = new Comment({
      movieId,
      rating,
      comment,
    });

    await newComment.save();

    res.status(201).json({ message: 'Comentario guardado exitosamente.', data: newComment });
  } catch (error) {
    console.error('Error al guardar el comentario:', error.message);
    res.status(500).json({ message: 'Error al guardar el comentario.' });
  }
});

module.exports = router;