// src/controllers/usuarioController.js
const { pool } = require('../config/Database');
const bcrypt = require('bcryptjs');

/**
 * GET /api/usuarios
 * Obtener todos los usuarios
 */
exports.getUsuarios = async (req, res) => {
  try {
    const { tipo } = req.query; // Filtro opcional por tipo

    let query = 'SELECT id, email, nombre, rfc, tipo, badge_level, wallet_address, created_at FROM usuarios';
    const params = [];

    if (tipo) {
      query += ' WHERE tipo = $1';
      params.push(tipo);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    res.json({
      total: result.rows.length,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

/**
 * GET /api/usuarios/:id
 * Obtener usuario por ID
 */
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        email, 
        nombre, 
        rfc, 
        tipo, 
        badge_level, 
        wallet_address,
        created_at,
        updated_at
      FROM usuarios 
      WHERE id = $1`, 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Si es agricultor, agregar estadísticas
    if (usuario.tipo === 'agricultor') {
      const statsResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT p.id) as total_parcelas,
          COALESCE(SUM(p.toneladas_co2), 0) as total_toneladas,
          COALESCE(SUM(p.toneladas_vendidas), 0) as toneladas_vendidas,
          COUNT(DISTINCT t.id) as total_ventas
        FROM parcelas p
        LEFT JOIN transacciones t ON p.id = t.parcela_id
        WHERE p.agricultor_id = $1`,
        [id]
      );

      usuario.estadisticas = {
        total_parcelas: parseInt(statsResult.rows[0].total_parcelas),
        total_toneladas: parseFloat(statsResult.rows[0].total_toneladas),
        toneladas_vendidas: parseFloat(statsResult.rows[0].toneladas_vendidas),
        total_ventas: parseInt(statsResult.rows[0].total_ventas)
      };
    }

    // Si es empresa, agregar estadísticas
    if (usuario.tipo === 'empresa') {
      const statsResult = await pool.query(
        `SELECT 
          COUNT(t.id) as total_compras,
          COALESCE(SUM(t.toneladas_compradas), 0) as toneladas_compensadas,
          COALESCE(SUM(t.precio_total), 0) as total_gastado
        FROM transacciones t
        WHERE t.empresa_id = $1`,
        [id]
      );

      usuario.estadisticas = {
        total_compras: parseInt(statsResult.rows[0].total_compras),
        toneladas_compensadas: parseFloat(statsResult.rows[0].toneladas_compensadas),
        total_gastado: parseFloat(statsResult.rows[0].total_gastado)
      };
    }

    res.json(usuario);

  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

/**
 * PUT /api/usuarios/:id
 * Actualizar usuario
 */
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, nombre, rfc, password, wallet_address, badge_level } = req.body;

  try {
    // Verificar que el usuario existe
    const checkUser = await pool.query('SELECT id, tipo FROM usuarios WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se proporciona email, verificar que no esté en uso por otro usuario
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }

    // Si se proporciona RFC, verificar que no esté en uso por otro usuario
    if (rfc) {
      const rfcCheck = await pool.query(
        'SELECT id FROM usuarios WHERE rfc = $1 AND id != $2',
        [rfc, id]
      );
      if (rfcCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El RFC ya está en uso' });
      }
    }

    // Hashear password si se proporciona
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    const result = await pool.query(
      `UPDATE usuarios 
       SET 
         email = COALESCE($1, email),
         nombre = COALESCE($2, nombre),
         rfc = COALESCE($3, rfc),
         password_hash = COALESCE($4, password_hash),
         wallet_address = COALESCE($5, wallet_address),
         badge_level = COALESCE($6, badge_level),
         updated_at = NOW()
       WHERE id = $7
       RETURNING id, email, nombre, rfc, tipo, badge_level, wallet_address, updated_at`,
      [email, nombre, rfc, hashedPassword, wallet_address, badge_level, id]
    );

    res.json({ 
      message: 'Usuario actualizado exitosamente', 
      usuario: result.rows[0] 
    });

  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Eliminar usuario
 */
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar si el usuario tiene registros relacionados
    const checkParcelas = await pool.query(
      'SELECT COUNT(*) as count FROM parcelas WHERE agricultor_id = $1',
      [id]
    );

    const checkTransacciones = await pool.query(
      'SELECT COUNT(*) as count FROM transacciones WHERE empresa_id = $1',
      [id]
    );

    if (parseInt(checkParcelas.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el usuario porque tiene parcelas asociadas',
        parcelas: parseInt(checkParcelas.rows[0].count)
      });
    }

    if (parseInt(checkTransacciones.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el usuario porque tiene transacciones asociadas',
        transacciones: parseInt(checkTransacciones.rows[0].count)
      });
    }

    // Eliminar usuario
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, email',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Usuario eliminado exitosamente', 
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

/**
 * GET /api/usuarios/tipo/:tipo
 * Obtener usuarios por tipo (agricultor o empresa)
 */
exports.getUsuariosPorTipo = async (req, res) => {
  const { tipo } = req.params;

  if (!['agricultor', 'empresa'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido. Debe ser "agricultor" o "empresa"' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        id, 
        email, 
        nombre, 
        rfc, 
        tipo, 
        badge_level, 
        wallet_address,
        created_at
      FROM usuarios 
      WHERE tipo = $1
      ORDER BY created_at DESC`,
      [tipo]
    );

    res.json({
      tipo,
      total: result.rows.length,
      usuarios: result.rows
    });

  } catch (error) {
    console.error('Error en getUsuariosPorTipo:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

/**
 * GET /api/usuarios/buscar
 * Buscar usuarios por nombre, email o RFC
 */
exports.buscarUsuarios = async (req, res) => {
  const { q } = req.query; // query string

  if (!q || q.length < 3) {
    return res.status(400).json({ error: 'El término de búsqueda debe tener al menos 3 caracteres' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        id, 
        email, 
        nombre, 
        rfc, 
        tipo, 
        badge_level, 
        wallet_address
      FROM usuarios 
      WHERE 
        nombre ILIKE $1 OR
        email ILIKE $1 OR
        rfc ILIKE $1
      ORDER BY nombre ASC
      LIMIT 50`,
      [`%${q}%`]
    );

    res.json({
      query: q,
      total: result.rows.length,
      usuarios: result.rows
    });

  } catch (error) {
    console.error('Error en buscarUsuarios:', error);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};