import { parseUnits } from "viem";

import { PolygonGasStationResponseScheme } from "../types/polygon-gas.js";

import type { FeeDataEIP1559 } from "../types/polygon-gas.js";
import type { EstimateGasParameters } from "viem";

export async function getPolygonFeeData(): Promise<EstimateGasParameters> {
  const feeData: FeeDataEIP1559 = await getPolygon1559FeeData();
  return {
    maxFeePerGas: parseUnits(String(feeData.maxFee), 9),
    maxPriorityFeePerGas: parseUnits(String(feeData.maxPriorityFee), 9),
  };
}

async function getPolygon1559FeeData(): Promise<FeeDataEIP1559> {
  const response = await fetch("https://gasstation.polygon.technology/v2");
  const data = PolygonGasStationResponseScheme.parse(await response.json());
  return data.fast;
}
