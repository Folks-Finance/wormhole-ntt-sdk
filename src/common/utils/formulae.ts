export function calcReferrerFeeAmount(nttAmount: bigint, dbps: bigint): bigint {
  return (nttAmount * dbps) / 100_000n;
}

export function createDecimalAmount(standarizedAmount: bigint, decimals: number): bigint {
  const STANDARDIZED_DECIMALS = 8n;
  return (standarizedAmount * 10n ** BigInt(decimals)) / 10n ** STANDARDIZED_DECIMALS;
}
