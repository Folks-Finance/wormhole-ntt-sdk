import { z } from "zod";

export type FeeDataEIP1559 = {
  maxPriorityFee: number;
  maxFee: number;
};

const PolygonGasStationGasDataScheme = z.object({
  maxPriorityFee: z.number(),
  maxFee: z.number(),
});

export const PolygonGasStationResponseScheme = z.object({
  safeLow: PolygonGasStationGasDataScheme,
  standard: PolygonGasStationGasDataScheme,
  fast: PolygonGasStationGasDataScheme,
  estimatedBaseFee: z.number(),
  blockTime: z.number(),
  blockNumber: z.number(),
});
