import type { AlgorandClient } from "@algorandfoundation/algokit-utils";

export async function getLocalStateAsBytes(
  provider: AlgorandClient,
  appId: bigint,
  address: string,
): Promise<Uint8Array> {
  const ai = await provider.client.algod.accountApplicationInformation(address, appId).do();
  if (!ai.appLocalState) throw new Error("cannot find local state");

  let ret = Buffer.alloc(0);
  const empty = Buffer.alloc(0);

  const e = Buffer.alloc(127);
  const m = Buffer.from("meta");

  const sk: Array<string> = [];
  const vals: Map<string, Buffer> = new Map<string, Buffer>();
  for (const kv of ai.appLocalState.keyValue ?? []) {
    const k = Buffer.from(kv.key);
    const key: number = k.readInt8();
    if (!Buffer.compare(k, m)) {
      continue;
    }
    const v: Buffer = Buffer.from(kv.value.bytes);
    if (Buffer.compare(v, e)) {
      vals.set(key.toString(), v);
      sk.push(key.toString());
    }
  }
  sk.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  for (const v of sk) {
    ret = Buffer.concat([ret, vals.get(v) ?? empty]);
  }
  return new Uint8Array(ret);
}
