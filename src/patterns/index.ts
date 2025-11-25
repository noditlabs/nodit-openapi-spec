// 공통 정규식 정의
const HEXA = "[0-9a-fA-F]";
const HEXA_PREFIX = `^0[xX]`;

export const Patterns = {
  // Common
  percentage: new RegExp(`^[0-9]+(?:\\.[0-9]+)?%$`),
  // integer: new RegExp(`^[-+]?[0-9]+$`),
  integer: (length?: number) =>
    length
      ? new RegExp(`^[-+]?[0-9]{${length}}$`)
      : new RegExp(`^[-+]?[0-9]+$`),
  unsignedInteger: (length?: number) =>
    length ? new RegExp(`^[0-9]{${length}}$`) : new RegExp(`^[0-9]+$`),

  // Readme Docs
  readme: {
    docs: {
      version: new RegExp(`^(main|\\d+\\.\\d+\\.\\d+)$`),
      id: new RegExp(`^${HEXA}{24}$`),
    },
  },

  // ISO
  iso4217: new RegExp(`^[A-Z]{3}$`),
  iso8601: new RegExp(
    `^[0-9]{4}-[0-9]{2}-[0-9]{2}` + // YYYY-MM-DD
      `T` + // 문자 'T'
      `[0-9]{2}:[0-9]{2}:[0-9]{2}` + // hh:mm:ss
      `(?:\\.[0-9]{1,3})?` + // 선택적 .SSS (1~3자리)
      `(?:Z|[+-][0-9]{2}:[0-9]{2})$` // Z 또는 ±HH:MM
  ),

  // Date
  date: {
    yyyymmdd: new RegExp(`^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$`),
    yyyymmddhh: new RegExp(
      `^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])-([01][0-9]|2[0-3])$`
    ),
  },
  timestamp: new RegExp(`^[0-9]{10}$`), // UNIX 타임스탬프 (10자리 숫자 문자열)

  // String
  string: {
    decimal: (length?: number) =>
      length ? new RegExp(`^[0-9]{${length}}$`) : new RegExp(`^[0-9]+$`),
    hexaDecimal: new RegExp(`^${HEXA}+$`),
    hexaDecimal8: new RegExp(`^${HEXA}{8}`),
    hexaDecimal32: new RegExp(`^${HEXA}{32}`),
    hexaDecimal64: new RegExp(`^${HEXA}{64}`),
    hexaDecimal80: new RegExp(`^${HEXA}{80}`),
    hexaDecimal128: new RegExp(`^${HEXA}{128}`),
    hexaDecimal512: new RegExp(`^${HEXA}{512}`),
    prefixedHexaDecimal: new RegExp(`${HEXA_PREFIX}${HEXA}+$`),
    prefixedHexaDecimal8: new RegExp(`${HEXA_PREFIX}${HEXA}{8}`),
    prefixedHexaDecimal32: new RegExp(`${HEXA_PREFIX}${HEXA}{32}`),
    prefixedHexaDecimal64: new RegExp(`${HEXA_PREFIX}${HEXA}{64}`),
    prefixedHexaDecimal512: new RegExp(`${HEXA_PREFIX}${HEXA}{512}`),
    uint32: new RegExp(`^[0-9]{1,10}$`),
    uint64: new RegExp(`^[0-9]{1,20}$`),
  },

  // Ethereum
  ethereum: {
    address: new RegExp(`${HEXA_PREFIX}${HEXA}{40}$`),
    transactionHash: new RegExp(`${HEXA_PREFIX}${HEXA}{64}$`),
    blockTag: new RegExp(`^(latest|earliest|pending|safe|finalized)$`),
    eventType: new RegExp(`^(newHeads|logs|newPendingTransactions|syncing)$`),
  },

  // Kaia
  kaia: {
    blockTag: new RegExp(`^(latest|earliest|pending)$`),
  },

  // Pagination
  pagination: {
    page: new RegExp(`^(?:[1-9][0-9]?|100)$`),
    rpp: new RegExp(`^(?:[1-9][0-9]{0,2}?|1000)$`),
  },

  // Aptos
  aptos: {
    address: new RegExp(`${HEXA_PREFIX}?${HEXA}{0,64}$`),
    resourceType: new RegExp(`^0x[0-9a-zA-Z:_<>]+$`),
    primitiveType: new RegExp(
      `^(bool|u8|u64|u128|address|signer|vector<.+>|0x[0-9a-zA-Z:_<, >]+)$`
    ),
    coinType: new RegExp(
      `^0x${HEXA}{1,64}::[a-z][a-zA-Z0-9_]*::[A-Z][a-zA-Z0-9_]*$`
    ),
  },

  // Bitcoin
  bitcoin: {
    // 비트코인 주소: P2PKH, P2SH, Bech32, Bech32m
    address: new RegExp(
      "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}" + // Legacy P2PKH
        "|3[a-km-zA-HJ-NP-Z1-9]{25,33}" + // Script P2SH
        "|bc1q[a-z0-9]{38,59}" + // SegWit P2WPKH or P2WSH
        "|bc1p[a-z0-9]{58})$" // Taproot P2TR
    ),
    transactionId: new RegExp(`^${HEXA}{64}$`),
    // transactionHash: new RegExp(`^${HEXA}{64}$`),
    assembly: new RegExp(`^[a-zA-Z0-9_]+(?:\\s[a-zA-Z0-9_]+)*$`),
  },

  // Tron
  tron: {
    address: new RegExp(`^T[1-9A-HJ-NP-Za-km-z]{33}$`),
    transactionHash: new RegExp(`${HEXA}{64}$`),
  },

  xrpl: {
    address: new RegExp(`^r[1-9A-HJ-NP-Za-km-z]{25,35}$`),
    transactionHash: new RegExp(`${HEXA}{64}$`),
  },
};
