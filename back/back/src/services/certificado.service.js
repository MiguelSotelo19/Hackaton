// src/services/certificadoService.js
const { jsPDF } = require('jspdf');
const QRCode = require('qrcode');
const { pool } = require('../config/Database');

/**
 * Generar certificado PDF (SIN guardarlo en disco)
 * Retorna el buffer del PDF
 */
const generarCertificadoBlockchain = async (compra_id, stellar_tx_hash) => {
  try {
    // 1. Obtener información completa de la compra
    const result = await pool.query(
      `SELECT 
        c.*,
        e.nombre as empresa_nombre,
        e.email as empresa_email,
        a.nombre as agricultor_nombre,
        a.badge_level as agricultor_badge
      FROM compras c
      JOIN usuarios e ON c.empresa_id = e.id
      JOIN usuarios a ON c.agricultor_id = a.id
      WHERE c.id = $1`,
      [compra_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Compra no encontrada');
    }

    const compra = result.rows[0];

    // 2. Generar QR code
    const stellar_explorer_url = `https://stellar.expert/explorer/testnet/tx/${stellar_tx_hash}`;
    const qrCodeDataUrl = await QRCode.toDataURL(stellar_explorer_url);

    // 3. Crear PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- Header ---
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CarbonCaña', pageWidth / 2, 20, { align: 'center' });
    
    // --- Título ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('Certificado de Compensación CO₂', pageWidth / 2, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date(compra.fecha_compra).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, pageWidth / 2, 52, { align: 'center' });
    
    // --- Empresa ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Empresa:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(compra.empresa_nombre, 20, 77);
    
    doc.setFontSize(9);
    doc.text(`Wallet: ${compra.empresa_wallet}`, 20, 84);
    
    // --- Toneladas ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text(`${parseInt(compra.toneladas)} Toneladas CO₂`, pageWidth / 2, 105, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('compensadas mediante caña de azúcar', pageWidth / 2, 112, { align: 'center' });
    
    // --- Detalles ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Detalles:', 20, 130);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Precio: $${parseFloat(compra.precio_total).toFixed(2)} USD`, 20, 138);
    doc.text(`Estado: ${compra.estado}`, 20, 145);
    
    // --- Agricultor ---
    doc.setFont('helvetica', 'bold');
    doc.text('Agricultor:', 20, 160);
    doc.setFont('helvetica', 'normal');
    const badgeEmoji = getBadgeEmoji(compra.agricultor_badge);
    doc.text(`${badgeEmoji} ${compra.agricultor_nombre}`, 20, 167);
    doc.text(`Badge: ${compra.agricultor_badge}`, 20, 174);
    
    // --- Blockchain ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Blockchain:', 20, 190);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Red: Stellar Testnet', 20, 197);
    doc.text(`TX: ${stellar_tx_hash.substring(0, 40)}...`, 20, 204);
    
    // --- QR Code ---
    doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 50, 180, 35, 35);
    doc.setFontSize(7);
    doc.text('Verificar en', pageWidth - 50, 218, { maxWidth: 35, align: 'center' });
    doc.text('Stellar Explorer', pageWidth - 50, 222, { maxWidth: 35, align: 'center' });
    
    // --- Footer ---
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFillColor(34, 197, 94);
    doc.rect(0, footerY, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('CarbonCaña - Tokenización de CO₂', pageWidth / 2, footerY + 7, { align: 'center' });
    doc.text(`Certificado #${compra_id}`, pageWidth / 2, footerY + 11, { align: 'center' });
    
    // 4. Retornar buffer del PDF (NO guardarlo)
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    console.log(`✅ Certificado generado para compra #${compra_id}`);
    
    return pdfBuffer;

  } catch (error) {
    console.error('Error generando certificado:', error);
    throw error;
  }
};

const getBadgeEmoji = (badge_level) => {
  const badges = {
    'nuevo': '🌱',
    'verificado': '✓',
    'confiable': '⭐',
    'elite': '👑'
  };
  return badges[badge_level] || '•';
};

module.exports = {
  generarCertificadoBlockchain
};