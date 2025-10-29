-- database/schema.sql
-- Schema optimizado para CarbonCaña

-- Extensión para generar UUIDs (opcional pero útil)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (agricultores y empresas)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('agricultor', 'empresa')),
  wallet_address VARCHAR(100),
  badge_level VARCHAR(20) DEFAULT 'nuevo' CHECK (badge_level IN ('nuevo', 'verificado', 'confiable', 'elite')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_usuarios_wallet ON usuarios(wallet_address);
CREATE INDEX idx_usuarios_badge ON usuarios(badge_level);

-- Tabla de parcelas
CREATE TABLE parcelas (
  id SERIAL PRIMARY KEY,
  agricultor_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  hectareas DECIMAL(10,2) NOT NULL CHECK (hectareas > 0),
  toneladas_co2 DECIMAL(10,2) NOT NULL CHECK (toneladas_co2 > 0),
  toneladas_vendidas DECIMAL(10,2) DEFAULT 0 CHECK (toneladas_vendidas >= 0),
  toneladas_disponibles DECIMAL(10,2) GENERATED ALWAYS AS (toneladas_co2 - toneladas_vendidas) STORED,
  precio_por_tonelada DECIMAL(10,2) DEFAULT 18.00 CHECK (precio_por_tonelada > 0),
  ubicacion_estado VARCHAR(100) NOT NULL,
  ubicacion_lat DECIMAL(10,6),
  ubicacion_lng DECIMAL(10,6),
  foto_url TEXT,
  fecha_siembra DATE,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para parcelas (CRÍTICO para performance del algoritmo)
CREATE INDEX idx_parcelas_disponible ON parcelas(disponible) WHERE disponible = TRUE;
CREATE INDEX idx_parcelas_agricultor ON parcelas(agricultor_id);
CREATE INDEX idx_parcelas_estado ON parcelas(ubicacion_estado);
CREATE INDEX idx_parcelas_toneladas ON parcelas(toneladas_disponibles) WHERE toneladas_disponibles > 0;

-- Tabla de transacciones
CREATE TABLE transacciones (
  id SERIAL PRIMARY KEY,
  empresa_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  parcela_id INT NOT NULL REFERENCES parcelas(id) ON DELETE CASCADE,
  toneladas_compradas DECIMAL(10,2) NOT NULL CHECK (toneladas_compradas > 0),
  precio_total DECIMAL(10,2) NOT NULL CHECK (precio_total > 0),
  fee_plataforma DECIMAL(10,2) NOT NULL CHECK (fee_plataforma >= 0),
  stellar_tx_hash VARCHAR(100),
  certificado_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para transacciones
CREATE INDEX idx_transacciones_empresa ON transacciones(empresa_id);
CREATE INDEX idx_transacciones_parcela ON transacciones(parcela_id);
CREATE INDEX idx_transacciones_fecha ON transacciones(created_at);
CREATE INDEX idx_transacciones_stellar ON transacciones(stellar_tx_hash);

-- Vista materializada para estadísticas de agricultores (optimización)
CREATE MATERIALIZED VIEW stats_agricultores AS
SELECT 
  p.agricultor_id,
  COUNT(DISTINCT t.id) as total_ventas,
  COALESCE(SUM(t.toneladas_compradas), 0) as total_toneladas_vendidas,
  COALESCE(SUM(t.precio_total), 0) as total_ingresos,
  COUNT(DISTINCT t.empresa_id) as empresas_distintas
FROM parcelas p
LEFT JOIN transacciones t ON p.id = t.parcela_id
GROUP BY p.agricultor_id;

-- Índice para la vista materializada
CREATE UNIQUE INDEX idx_stats_agricultores ON stats_agricultores(agricultor_id);

-- Función para refrescar stats (llamar después de cada transacción)
CREATE OR REPLACE FUNCTION refresh_stats_agricultores()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY stats_agricultores;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-refresh de stats
CREATE TRIGGER trigger_refresh_stats
AFTER INSERT OR UPDATE OR DELETE ON transacciones
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_stats_agricultores();

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER set_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_parcelas_updated_at
BEFORE UPDATE ON parcelas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();