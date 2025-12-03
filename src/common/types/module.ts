import type { ChainType } from "./chain.js";
import type {
  PrepareManualCompleteTransferAVMCall,
  PrepareManualInitiateTransferAVMCall,
  PrepareTransferAVMCall,
} from "../../chains/avm/types/module.js";
import type {
  PrepareManualCompleteTransferEVMCall,
  PrepareManualInitiateTransferEVMCall,
  PrepareTransferEVMCall,
} from "../../chains/evm/types/module.js";

export type PrepareManualInitiateTransferCall<T extends ChainType> = {
  [ChainType.EVM]: PrepareManualInitiateTransferEVMCall;
  [ChainType.AVM]: PrepareManualInitiateTransferAVMCall;
}[T];

export type PrepareManualCompleteTransferCall<T extends ChainType> = {
  [ChainType.EVM]: PrepareManualCompleteTransferEVMCall;
  [ChainType.AVM]: PrepareManualCompleteTransferAVMCall;
}[T];

export type PrepareTransferCall<T extends ChainType> = {
  [ChainType.EVM]: PrepareTransferEVMCall;
  [ChainType.AVM]: PrepareTransferAVMCall;
}[T];
