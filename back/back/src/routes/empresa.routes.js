// src/routes/empresa.routes.js
const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { getDashboardEmpresa } = require('../controllers/marketplaceController');
const { getHistorialCompras } = require('../controllers/compraController');
const { descargarCertificado } = require('../services/certificadoService');

const router = express.Router();

router.get('/:id/dashboard', authMiddleware, getDashboardEmpresa);
router.get('/:id/compras', authMiddleware, getHistorialCompras);
router.get('/certificado/:transaccion_id', authMiddleware, descargarCertificado);

module.exports = router;