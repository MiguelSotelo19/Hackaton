// server.js
require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/Database');

const PORT = process.env.PORT || 3000;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('✅ Base de datos conectada:', res.rows[0].now);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     🌿 CarbonCaña Backend API           ║
║                                          ║
║     Server running on port ${PORT}        ║
║     Environment: ${process.env.NODE_ENV || 'development'}            ║
║                                          ║
║     Health: http://localhost:${PORT}/health  ║
╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    pool.end(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  server.close(() => {
    pool.end(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});