export const bigIntMax = (...args: Array<bigint>) => args.reduce((m, e) => (e > m ? e : m));
export const bigIntMin = (...args: Array<bigint>) => args.reduce((m, e) => (e < m ? e : m));

const STANDARDIZED_DECIMALS = 8n;

export function calcReferrerFeeAmount(nttAmount: bigint, dbps: bigint): bigint {
  return (nttAmount * dbps) / 100_000n;
}

export function createDecimalAmount(standarizedAmount: bigint, decimals: number): bigint {
  return (standarizedAmount * 10n ** BigInt(decimals)) / 10n ** STANDARDIZED_DECIMALS;
}

export function doesTransferHaveDust(amount: bigint, sourceDecimals: number, destDecimals: number): boolean {
  const srcDec = BigInt(sourceDecimals);
  const dstDec = BigInt(destDecimals);
  const effectiveDec = bigIntMin(srcDec, STANDARDIZED_DECIMALS);

  // reduce to effective precision (STANDARDIZED_DECIMALS acts as a cap)
  let reduced = amount;
  if (srcDec > effectiveDec) {
    const factor = 10n ** (srcDec - effectiveDec);
    if (amount % factor !== 0n) return true;
    reduced = amount / factor;
  }

  // check destination can represent the reduced amount exactly
  if (dstDec < effectiveDec) {
    const factor = 10n ** (effectiveDec - dstDec);
    if (reduced % factor !== 0n) return true;
  }

  return false;
}
