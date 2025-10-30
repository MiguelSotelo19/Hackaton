// src/controllers/blockchainController.js
const { pool } = require('../config/Database');
const { generarCertificadoBlockchain } = require('../services/certificado.service'); // ← Agregar esta línea

/**
 * POST /api/blockchain/compra
 * Guardar una compra de tokens realizada en blockchain
 */
exports.registrarCompra = async (req, res) => {
  try {
    const {
      empresa_id,
      empresa_wallet,
      agricultor_id,
      agricultor_wallet,
      toneladas,
      precio_total,
      stellar_tx_hash
    } = req.body;

    // Validar datos obligatorios
    if (!empresa_id || !agricultor_id || !toneladas || !stellar_tx_hash) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios: empresa_id, agricultor_id, toneladas, stellar_tx_hash'
      });
    }

    // Verificar que no se duplique el tx_hash
    const duplicado = await pool.query(
      'SELECT id FROM compras WHERE stellar_tx_hash = $1',
      [stellar_tx_hash]
    );

    if (duplicado.rows.length > 0) {
      return res.status(400).json({
        error: 'Esta transacción ya fue registrada',
        compra_id: duplicado.rows[0].id
      });
    }

    // Insertar en la tabla compras
    const result = await pool.query(
      `INSERT INTO compras (
        empresa_id,
        empresa_wallet,
        agricultor_id,
        agricultor_wallet,
        toneladas,
        precio_total,
        stellar_tx_hash,
        fecha_compra,
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'completada')
      RETURNING *`,
      [
        empresa_id,
        empresa_wallet,
        agricultor_id,
        agricultor_wallet,
        toneladas,
        precio_total || toneladas * 50, // Default $50 por tonelada
        stellar_tx_hash
      ]
    );

    const compra = result.rows[0];
    console.log('✅ Compra blockchain registrada:', compra.id);

    // Intentar generar PDF
    try {
      const pdfBuffer = await generarCertificadoBlockchain(compra.id, stellar_tx_hash);
      
      // Configurar headers para descarga automática
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificado_${compra.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('X-Compra-Id', compra.id);
      res.setHeader('X-Explorer-URL', `https://stellar.expert/explorer/testnet/tx/${stellar_tx_hash}`);
      
      // Enviar el PDF
      return res.send(pdfBuffer);
      
    } catch (pdfError) {
      console.error('⚠️ Error generando PDF:', pdfError.message);
      
      // Si falla el PDF, devolver JSON
      return res.status(201).json({
        message: 'Compra registrada exitosamente (PDF no disponible)',
        compra: {
          id: compra.id,
          empresa_id: compra.empresa_id,
          agricultor_id: compra.agricultor_id,
          toneladas: compra.toneladas,
          precio_total: compra.precio_total,
          stellar_tx_hash: compra.stellar_tx_hash,
          fecha_compra: compra.fecha_compra,
          estado: compra.estado
        },
        explorer_url: `https://stellar.expert/explorer/testnet/tx/${stellar_tx_hash}`,
        error_pdf: pdfError.message
      });
    }

  } catch (error) {
    console.error('❌ Error en registrarCompra:', error);
    res.status(500).json({
      error: 'Error al registrar la compra',
      details: error.message
    });
  }
};

/**
 * POST /api/blockchain/mint
 * Registrar que se mintearon tokens a un agricultor
 */
exports.registrarMinteo = async (req, res) => {
  try {
    const {
      agricultor_id,
      parcela_id,
      toneladas,
      stellar_tx_hash
    } = req.body;

    // Validar datos
    if (!agricultor_id || !parcela_id || !toneladas || !stellar_tx_hash) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios: agricultor_id, parcela_id, toneladas, stellar_tx_hash'
      });
    }

    // Verificar duplicados
    const duplicado = await pool.query(
      'SELECT id FROM minteos WHERE stellar_tx_hash = $1',
      [stellar_tx_hash]
    );

    if (duplicado.rows.length > 0) {
      return res.status(400).json({
        error: 'Este minteo ya fue registrado',
        minteo_id: duplicado.rows[0].id
      });
    }

    // Insertar minteo
    const result = await pool.query(
      `INSERT INTO minteos (
        agricultor_id,
        parcela_id,
        toneladas,
        stellar_tx_hash,
        fecha_minteo
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING *`,
      [agricultor_id, parcela_id, toneladas, stellar_tx_hash]
    );

    const minteo = result.rows[0];

    console.log('✅ Minteo blockchain registrado:', minteo.id);

    res.status(201).json({
      message: 'Minteo registrado exitosamente',
      minteo: {
        id: minteo.id,
        agricultor_id: minteo.agricultor_id,
        parcela_id: minteo.parcela_id,
        toneladas: minteo.toneladas,
        stellar_tx_hash: minteo.stellar_tx_hash,
        fecha_minteo: minteo.fecha_minteo
      },
      explorer_url: `https://stellar.expert/explorer/testnet/tx/${stellar_tx_hash}`
    });

  } catch (error) {
    console.error('❌ Error en registrarMinteo:', error);
    res.status(500).json({
      error: 'Error al registrar el minteo',
      details: error.message
    });
  }
};

/**
 * POST /api/blockchain/badge
 * Registrar que se otorgó un badge NFT
 */
exports.registrarBadge = async (req, res) => {
  try {
    const {
      agricultor_id,
      badge_type,
      stellar_tx_hash
    } = req.body;

    // Validar
    if (!agricultor_id || !badge_type || !stellar_tx_hash) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios: agricultor_id, badge_type, stellar_tx_hash'
      });
    }

    // Validar badge_type
    const validBadges = [
        'nuevo', 
        'verificado', 
        'confiable', 
        'elite'
    ];
    if (!validBadges.includes(badge_type)) {
      return res.status(400).json({
        error: `Badge inválido. Debe ser: ${validBadges.join(', ')}`
      });
    }

    // Insertar badge
    const result = await pool.query(
      `INSERT INTO badges (
        agricultor_id,
        badge_type,
        stellar_tx_hash,
        fecha_otorgado
      ) VALUES ($1, $2, $3, NOW())
      RETURNING *`,
      [agricultor_id, badge_type, stellar_tx_hash]
    );

    const badge = result.rows[0];

    // Actualizar badge_level en usuario
    await pool.query(
      'UPDATE usuarios SET badge_level = $1, updated_at = NOW() WHERE id = $2',
      [badge_type, agricultor_id]
    );

    console.log('✅ Badge blockchain registrado:', badge.id);

    res.status(201).json({
      message: 'Badge registrado exitosamente',
      badge: {
        id: badge.id,
        agricultor_id: badge.agricultor_id,
        badge_type: badge.badge_type,
        stellar_tx_hash: badge.stellar_tx_hash,
        fecha_otorgado: badge.fecha_otorgado
      },
      explorer_url: `https://stellar.expert/explorer/testnet/tx/${stellar_tx_hash}`
    });

  } catch (error) {
    console.error('❌ Error en registrarBadge:', error);
    res.status(500).json({
      error: 'Error al registrar el badge',
      details: error.message
    });
  }
};

/**
 * GET /api/blockchain/verificar/:txHash
 * Obtener info de una transacción
 */
exports.verificarTransaccion = async (req, res) => {
  try {
    const { txHash } = req.params;

    // Buscar en compras
    const compra = await pool.query(
      'SELECT * FROM compras WHERE stellar_tx_hash = $1',
      [txHash]
    );

    if (compra.rows.length > 0) {
      return res.json({
        tipo: 'compra',
        data: compra.rows[0],
        explorer_url: `https://stellar.expert/explorer/testnet/tx/${txHash}`
      });
    }

    // Buscar en minteos
    const minteo = await pool.query(
      'SELECT * FROM minteos WHERE stellar_tx_hash = $1',
      [txHash]
    );

    if (minteo.rows.length > 0) {
      return res.json({
        tipo: 'minteo',
        data: minteo.rows[0],
        explorer_url: `https://stellar.expert/explorer/testnet/tx/${txHash}`
      });
    }

    // Buscar en badges
    const badge = await pool.query(
      'SELECT * FROM badges WHERE stellar_tx_hash = $1',
      [txHash]
    );

    if (badge.rows.length > 0) {
      return res.json({
        tipo: 'badge',
        data: badge.rows[0],
        explorer_url: `https://stellar.expert/explorer/testnet/tx/${txHash}`
      });
    }

    // No encontrado en DB, pero dar link al explorer
    res.json({
      message: 'Transacción no encontrada en la base de datos',
      explorer_url: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
      tip: 'Verifica la transacción en Stellar Explorer'
    });

  } catch (error) {
    console.error('❌ Error en verificarTransaccion:', error);
    res.status(500).json({
      error: 'Error al verificar transacción',
      details: error.message
    });
  }
};

/**
 * GET /api/blockchain/config
 * Obtener configuración de blockchain (CONTRACT_ID, etc)
 */
exports.getConfig = async (req, res) => {
  res.json({
    network: 'TESTNET',
    contract_id: 'CD7KYQLIG5267F7RJSJJ6ROIFALDWURATKVDSKRYJTLD6LTMXZFSL2LS',
    rpc_url: 'https://soroban-testnet.stellar.org',
    explorer_url: 'https://stellar.expert/explorer/testnet',
    network_passphrase: 'Test SDF Network ; September 2015'
  });
};