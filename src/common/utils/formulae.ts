export function calcReferrerFeeAmount(nttAmount: bigint, dbps: bigint): bigint {
  return (nttAmount * dbps) / 100_000n;
}
