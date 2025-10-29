const express = require('express');
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} = require('../controller/usuario.controller');

const router = express.Router();

router.get('/', getUsuarios);

router.get('/:id', authMiddleware, getUsuarioById);

router.put('/:id', authMiddleware,updateUsuario);

router.delete('/:id',authMiddleware, deleteUsuario);

module.exports = router;
