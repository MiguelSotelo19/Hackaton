import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "clave_super_segura";

export const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    },
    SECRET,
    { expiresIn: "7d" }
  );
};
