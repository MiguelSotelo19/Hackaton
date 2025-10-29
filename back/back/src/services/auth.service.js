import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { generarToken } from "../utils/jwt.js";

// Registrar Agricultor
export const registrarAgricultor = async ({ nombre, email, password }) => {
  const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
  if (existe.rows.length > 0) throw new Error("El correo ya está registrado");

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (email, password_hash, nombre, tipo)
     VALUES ($1, $2, $3, 'agricultor') RETURNING id, email, nombre, tipo`,
    [email, hash, nombre]
  );

  return { message: "Agricultor registrado correctamente", usuario: result.rows[0] };
};

// Registrar Empresa
export const registrarEmpresa = async ({ nombre, email, password }) => {
  const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
  if (existe.rows.length > 0) throw new Error("El correo ya está registrado");

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuarios (email, password_hash, nombre, tipo)
     VALUES ($1, $2, $3, 'empresa') RETURNING id, email, nombre, tipo`,
    [email, hash, nombre]
  );

  return { message: "Empresa registrada correctamente", usuario: result.rows[0] };
};

// Login
export const login = async ({ email, password }) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

  if (result.rows.length === 0) throw new Error("Usuario no encontrado");

  const usuario = result.rows[0];

  const coincide = await bcrypt.compare(password, usuario.password_hash);
  if (!coincide) throw new Error("Contraseña incorrecta");

  const token = generarToken(usuario);

  return {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      tipo: usuario.tipo,
      badge_level: usuario.badge_level,
      wallet_address: usuario.wallet_address,
    },
  };
};
