// src/routes/marketplace.routes.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  getMarketplace,
  optimizarCompraEndpoint
} = require('../controllers/marketplaceController');
const { procesarCompra } = require('../controllers/compraController');

const router = express.Router();

router.get('/', getMarketplace);
router.post('/optimizar-compra', optimizarCompraEndpoint);
router.post('/comprar', authMiddleware, procesarCompra);

module.exports = router;