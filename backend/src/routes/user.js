const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Intentando registrar usuario:', email);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('El correo electrónico ya está registrado:', email);
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Crear un token JWT
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    console.log('Usuario registrado exitosamente:', email);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Intentando iniciar sesión:', email);

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Correo o contraseña incorrectos:', email);
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Correo o contraseña incorrectos:', email);
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Crear un token JWT
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    console.log('Inicio de sesión exitoso:', email);
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;