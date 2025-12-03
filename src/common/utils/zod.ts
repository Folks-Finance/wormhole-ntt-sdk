import { z } from "zod";

export const preprocessBigInt = (value: unknown) => {
  if (typeof value === "string") return BigInt(value);
  return value;
};

export const preprocessNumber = (value: unknown) => {
  if (typeof value === "string") return Number.parseInt(value, 10);
  return value;
};

const HEX_REGEX = /^(0x)?[\dA-Fa-f]+$/;
const HEX_PREFIX_REGEX = /^0x/;

export const hexString = (length?: number) =>
  z
    .string()
    .regex(HEX_REGEX, "Must be a hex string")
    .refine(
      (val) => length === undefined || val.replace(HEX_PREFIX_REGEX, "").length === length,
      length ? `Must be ${length} hex characters long` : undefined,
    );
