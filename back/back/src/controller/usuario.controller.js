const { pool } = require('../config/Database');
const bcrypt = require('bcryptjs');

exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, nombre, tipo, badge_level, wallet_address FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, email, nombre, tipo, badge_level, wallet_address FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, nombre, password, wallet_address, badge_level } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE usuarios 
       SET email = COALESCE($1, email),
           nombre = COALESCE($2, nombre),
           password_hash = COALESCE($3, password_hash),
           wallet_address = COALESCE($4, wallet_address),
           badge_level = COALESCE($5, badge_level),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, nombre, tipo, badge_level, wallet_address`,
      [email, nombre, hashedPassword, wallet_address, badge_level, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
