// src/lib/stellar-config.ts
export const STELLAR_CONFIG = {
  // Smart Contract deployado en Stellar Testnet
  CONTRACT_ID: 'CD7KYQLIG5267F7RJSJJ6ROIFALDWURATKVDSKRYJTLD6LTMXZFSL2LS',
  
  // Network configuración
  NETWORK: 'TESTNET',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  
  // Explorer para ver transacciones
  EXPLORER_URL: 'https://stellar.expert/explorer/testnet',
  
  // Cuentas (solo las públicas, NUNCA secret keys en frontend)
  ACCOUNTS: {
    ADMIN: 'GCOZASBJNGCYTKTI4UOSR3ARPIZE5KIUHXNJRENP5BNL3RG2QKFUOT3U',
    AGRICULTOR1: 'GCMZLUK7IR3I2Q56HJEK34J6INYGDUEJZT7L4PGY56UDEKWYKZCYWUHC',
    AGRICULTOR2: 'GBA54NWU224HNMZORQ5DMQGFZNAO4A3IAH72A65OXW5T4UNDX27HQ4VD',
    AGRICULTOR3: 'GBW5TNXD64BX4QJ3K5OORSMBLVBH6DHNMQPQIK7THCF64DSIWXAGHVHA',
    EMPRESA1: 'GA4D7WA54FHEXCFSDXWTQF2BAK3CNQEZZ4QHH3Z5ZMYO4AVAJ2FDDCNR',
    EMPRESA2: 'GDHNQ3RD6CMZZGKUKZAUSOD5ESJWCUU7MZHO62KP6YQS7KYRUCZABKJE',
  },
  
  // Funciones del smart contract
  CONTRACT_FUNCTIONS: {
    INITIALIZE: 'initialize',
    MINT: 'mint',
    TRANSFER: 'transfer',
    BALANCE: 'balance',
    MINT_BADGE: 'mint_badge',
    HAS_BADGE: 'has_badge',
  },
  
  // Configuración de gas y fees
  FEE: '100000', // 0.01 XLM
  TIMEOUT: 180, // 3 minutos
} as const;

// Helper para obtener URL del explorer de una transacción
export const getExplorerTxUrl = (txHash: string): string => {
  return `${STELLAR_CONFIG.EXPLORER_URL}/tx/${txHash}`;
};

// Helper para obtener URL del explorer de una cuenta
export const getExplorerAccountUrl = (accountId: string): string => {
  return `${STELLAR_CONFIG.EXPLORER_URL}/account/${accountId}`;
};

export type StellarNetwork = typeof STELLAR_CONFIG.NETWORK;
export type ContractFunction = typeof STELLAR_CONFIG.CONTRACT_FUNCTIONS[keyof typeof STELLAR_CONFIG.CONTRACT_FUNCTIONS];