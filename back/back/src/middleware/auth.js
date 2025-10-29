const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "clave_super_segura";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expirado o inválido" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "No autenticado" });
  if (req.user.tipo !== role) return res.status(403).json({ error: "No autorizado" });
  next();
};

module.exports = { authMiddleware, requireRole };