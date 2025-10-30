// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

/*app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));*/
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Agregar ambos puertos
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/certificados', express.static(path.join(__dirname, '../certificados')));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'CarbonCaña Backend',
    timestamp: new Date().toISOString() 
  });
});

// API Routes - Las agregaremos después
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const usuarioRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuarioRoutes);

const parcelaRoutes = require('./routes/parcela.routes');
app.use('/api/parcelas',parcelaRoutes)

  const blockchainRoutes = require('./routes/blockchain.routes');
  app.use('/api/blockchain', blockchainRoutes);

try {
  const marketplaceRoutes = require('./routes/marketplace.routes');
  app.use('/api/marketplace', marketplaceRoutes);
} catch (e) {
  console.log('⚠️  marketplace.routes not found');
}

try {
  const empresaRoutes = require('./routes/empresa.routes');
  app.use('/api/empresa', empresaRoutes);
} catch (e) {
  console.log('⚠️  empresa.routes not found');
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;