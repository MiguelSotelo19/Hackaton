const { pool } = require("../config/Database");

// Obtener todas las parcelas
const getParcelas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM parcelas");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener parcelas" });
  }
};

// Obtener parcela por ID
const getParcelaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM parcelas WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Parcela no encontrada" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la parcela" });
  }
};

// Crear parcela
const createParcela = async (req, res) => {
  const { hectareas, toneladas_co2, precio_por_tonelada, ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra } = req.body;
  const agricultor_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO parcelas (agricultor_id, hectareas, toneladas_co2, precio_por_tonelada, ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [agricultor_id, hectareas, toneladas_co2, precio_por_tonelada, ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra]
    );

    res.status(201).json({ message: "Parcela creada", parcela: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la parcela" });
  }
};

// Actualizar parcela
const updateParcela = async (req, res) => {
  const { id } = req.params;
  const agricultor_id = req.user.id;
  const { hectareas, toneladas_co2, precio_por_tonelada, ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra, disponible } = req.body;

  try {
    // Verificar que la parcela pertenece al agricultor
    const parcelaCheck = await pool.query("SELECT * FROM parcelas WHERE id = $1 AND agricultor_id = $2", [id, agricultor_id]);
    if (parcelaCheck.rows.length === 0) return res.status(403).json({ error: "No autorizado para actualizar esta parcela" });

    const result = await pool.query(
      `UPDATE parcelas
       SET hectareas=$1, toneladas_co2=$2, precio_por_tonelada=$3, ubicacion_estado=$4, ubicacion_lat=$5, ubicacion_lng=$6, foto_url=$7, fecha_siembra=$8, disponible=$9, updated_at=NOW()
       WHERE id=$10
       RETURNING *`,
      [hectareas, toneladas_co2, precio_por_tonelada, ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra, disponible, id]
    );

    res.json({ message: "Parcela actualizada", parcela: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la parcela" });
  }
};

// Eliminar parcela
const deleteParcela = async (req, res) => {
  const { id } = req.params;
  const agricultor_id = req.user.id;

  try {
    const parcelaCheck = await pool.query("SELECT * FROM parcelas WHERE id = $1 AND agricultor_id = $2", [id, agricultor_id]);
    if (parcelaCheck.rows.length === 0) return res.status(403).json({ error: "No autorizado para eliminar esta parcela" });

    await pool.query("DELETE FROM parcelas WHERE id = $1", [id]);
    res.json({ message: "Parcela eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la parcela" });
  }
};

module.exports = { getParcelas, getParcelaById, createParcela, updateParcela, deleteParcela };
