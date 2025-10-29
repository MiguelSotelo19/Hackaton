// src/routes/blockchain.routes.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  registrarCompra,
  registrarMinteo,
  registrarBadge,
  verificarTransaccion,
  getConfig
} = require('../controller/blockchain.controller');

const router = express.Router();

// Configuración pública (para que frontend sepa el CONTRACT_ID)
router.get('/config', getConfig);

// Verificar transacción (puede ser pública o autenticada según prefieran)
router.get('/verificar/:txHash', verificarTransaccion);

// Registrar compra (llamado desde frontend después de la transacción)
router.post('/compra', authMiddleware, registrarCompra);

// Registrar minteo (cuando se crean tokens nuevos)
router.post('/mint', authMiddleware, registrarMinteo);

// Registrar badge (cuando se otorga un badge NFT)
router.post('/badge', authMiddleware, registrarBadge);

module.exports = router;