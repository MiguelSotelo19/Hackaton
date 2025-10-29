require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/Database');

const seed = async () => {
  console.log('🌱 Iniciando seed de base de datos...\n');

  try {
    // Limpiar tablas existentes
    console.log('🗑️  Limpiando tablas...');
    await pool.query('TRUNCATE usuarios, parcelas, transacciones RESTART IDENTITY CASCADE');

    // 1. CREAR AGRICULTORES
    console.log('👨‍🌾 Creando agricultores...');
    const password_hash = await bcrypt.hash('password123', 10);

    const agricultores = [
      { nombre: 'Juan Pérez García', email: 'juan@agricola.com', wallet: 'GAJPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'PEGA850315HX2' },
      { nombre: 'María Rodríguez', email: 'maria@campo.com', wallet: 'GBKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'ROMA920607MN5' },
      { nombre: 'Carlos Hernández', email: 'carlos@azucar.com', wallet: 'GCKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'HERC880212PL8' },
      { nombre: 'Ana Martínez López', email: 'ana@verde.com', wallet: 'GDKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'MALA931125KJ3' },
      { nombre: 'Roberto Sánchez', email: 'roberto@cana.com', wallet: 'GEKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'SANR870419RT6' },
      { nombre: 'Laura González', email: 'laura@organico.com', wallet: 'GFKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'GOLA900823WS9' },
      { nombre: 'Pedro Ramírez', email: 'pedro@sustentable.com', wallet: 'GGKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'RAMP860530QF1' },
      { nombre: 'Isabel Torres', email: 'isabel@eco.com', wallet: 'GHKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'TOII941017ZX4' },
      { nombre: 'Miguel Flores', email: 'miguel@natural.com', wallet: 'GIKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'FLOM891203CV7' },
      { nombre: 'Carmen Díaz', email: 'carmen@tierra.com', wallet: 'GJKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'DIAC920915BN2' }
    ];

    const agricultoresIds = [];
    for (const ag of agricultores) {
      const result = await pool.query(
        `INSERT INTO usuarios (email, password_hash, nombre, rfc, tipo, wallet_address, badge_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [ag.email, password_hash, ag.nombre, ag.rfc, 'agricultor', ag.wallet, 'verificado']
      );
      agricultoresIds.push(result.rows[0].id);
    }
    console.log(`✅ ${agricultores.length} agricultores creados`);

    // 2. CREAR EMPRESAS
    console.log('🏢 Creando empresas...');
    const empresas = [
      { nombre: 'Coca-Cola México', email: 'sustentabilidad@cocacola.mx', wallet: 'GAKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'CCM940825KP3' },
      { nombre: 'Cemex Verde', email: 'verde@cemex.com', wallet: 'GBKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'CVE830612LM7' },
      { nombre: 'Bimbo Sustentable', email: 'carbon@bimbo.com', wallet: 'GCKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'BIS910304NQ5' },
      { nombre: 'Walmart México', email: 'esg@walmart.mx', wallet: 'GDKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'WME870719RT8' },
      { nombre: 'Microsoft México', email: 'sustainability@microsoft.mx', wallet: 'GEKPQ7LZZXM6MFZJBHZWXM4NFZJBHZWXM4NFZJBHZWX', rfc: 'MIM950128XW1' }
    ];

    const empresasIds = [];
    for (const emp of empresas) {
      const result = await pool.query(
        `INSERT INTO usuarios (email, password_hash, nombre, rfc, tipo, wallet_address)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [emp.email, password_hash, emp.nombre, emp.rfc, 'empresa', emp.wallet]
      );
      empresasIds.push(result.rows[0].id);
    }
    console.log(`✅ ${empresas.length} empresas creadas`);

    // 3. CREAR PARCELAS
    console.log('🌾 Creando parcelas...');
    const estados = [
      { nombre: 'Morelos', lat: 18.6813, lng: -99.1013 },
      { nombre: 'Veracruz', lat: 19.1738, lng: -96.1342 },
      { nombre: 'Jalisco', lat: 20.6597, lng: -103.3496 },
      { nombre: 'San Luis Potosí', lat: 22.1565, lng: -100.9855 },
      { nombre: 'Tamaulipas', lat: 24.2669, lng: -98.8363 }
    ];

    const fotos = [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399'
    ];

    const parcelasIds = [];
    for (let i = 0; i < 20; i++) {
      const agricultor_id = agricultoresIds[i % agricultoresIds.length];
      const estado = estados[i % estados.length];
      const hectareas = (Math.random() * 15 + 5).toFixed(2);
      const toneladas_co2 = (hectareas * (Math.random() * 3 + 5)).toFixed(2);
      const precio = (Math.random() * 4 + 16).toFixed(2);
      const fecha_siembra = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);

      const result = await pool.query(
        `INSERT INTO parcelas 
         (agricultor_id, hectareas, toneladas_co2, precio_por_tonelada, 
          ubicacion_estado, ubicacion_lat, ubicacion_lng, foto_url, fecha_siembra)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          agricultor_id,
          hectareas,
          toneladas_co2,
          precio,
          estado.nombre,
          estado.lat + (Math.random() - 0.5) * 0.5,
          estado.lng + (Math.random() - 0.5) * 0.5,
          fotos[i % fotos.length],
          fecha_siembra
        ]
      );
      parcelasIds.push(result.rows[0].id);
    }
    console.log(`✅ ${parcelasIds.length} parcelas creadas`);

    // 4. CREAR TRANSACCIONES HISTÓRICAS
    console.log('💰 Creando transacciones históricas...');
    for (let i = 0; i < 15; i++) {
      const empresa_id = empresasIds[i % empresasIds.length];
      const parcela_id = parcelasIds[i];

      const parcelaResult = await pool.query(
        'SELECT toneladas_co2, precio_por_tonelada FROM parcelas WHERE id = $1',
        [parcela_id]
      );
      const parcela = parcelaResult.rows[0];

      const toneladas = (Math.random() * parseFloat(parcela.toneladas_co2) * 0.5).toFixed(2);
      const precio_subtotal = toneladas * parseFloat(parcela.precio_por_tonelada);
      const fee = precio_subtotal * 0.05;
      const precio_total = precio_subtotal + fee;

      const stellar_tx = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const fecha = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO transacciones 
         (empresa_id, parcela_id, toneladas_compradas, precio_total, fee_plataforma, 
          stellar_tx_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [empresa_id, parcela_id, toneladas, precio_total, fee, stellar_tx, fecha]
      );

      await pool.query(
        'UPDATE parcelas SET toneladas_vendidas = toneladas_vendidas + $1 WHERE id = $2',
        [toneladas, parcela_id]
      );
    }
    console.log(`✅ 15 transacciones históricas creadas`);

    // 5. ACTUALIZAR BADGES
    console.log('🎖️  Actualizando badges de agricultores...');
    await pool.query(
      'UPDATE usuarios SET badge_level = $1 WHERE id = ANY($2)',
      ['elite', [agricultoresIds[0], agricultoresIds[1]]]
    );
    await pool.query(
      'UPDATE usuarios SET badge_level = $1 WHERE id = ANY($2)',
      ['confiable', [agricultoresIds[2], agricultoresIds[3], agricultoresIds[4]]]
    );
    console.log('✅ Badges actualizados');

    // 6. REFRESCAR VISTA MATERIALIZADA
    await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY stats_agricultores');
    console.log('✅ Vista materializada actualizada');

    // 7. MOSTRAR RESUMEN
    console.log('\n═══════════════════════════════════════');
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log(`Agricultores: ${agricultores.length}`);
    console.log(`Empresas: ${empresas.length}`);
    console.log(`Parcelas: ${parcelasIds.length}`);
    console.log(`Transacciones: 15`);
    console.log('\n📝 Credenciales de prueba:');
    console.log('Agricultor:');
    console.log('  Email: juan@agricola.com');
    console.log('  Password: password123');
    console.log('  RFC: PEGA850315HX2');
    console.log('\nEmpresa:');
    console.log('  Email: sustentabilidad@cocacola.mx');
    console.log('  Password: password123');
    console.log('  RFC: CCM940825KP3\n');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await pool.end();
    console.log('Conexión cerrada');
    process.exit(0);
  }
};

seed();