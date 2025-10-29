const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/Database');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

exports.register = async (req, res) => {
  const { email, password, nombre, tipo } = req.body;

  try {
    if (!email || !password || !nombre || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (!['agricultor', 'empresa'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido (agricultor o empresa)' });
    }

    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash, nombre, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, nombre, tipo, badge_level, wallet_address`,
      [email, hashedPassword, nombre, tipo]
    );

    const usuario = result.rows[0];

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario,
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Comparar contraseña
    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        badge_level: usuario.badge_level,
        wallet_address: usuario.wallet_address,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
