export const TMPL_SIG_TEAL = `#pragma version 6
pushint TMPL_ADDR_IDX
pop
pushbytes TMPL_EMITTER_ID
pop
txn TypeEnum
int appl
==
assert
txn OnCompletion
int OptIn
==
assert
txn ApplicationID
pushint TMPL_APP_ID
==
assert
txn RekeyTo
pushbytes TMPL_APP_ADDRESS
==
assert
txn Fee
pushint 0
==
assert
txn CloseRemainderTo
global ZeroAddress
==
assert
txn AssetCloseTo
global ZeroAddress
==
assert
int 1
`;
