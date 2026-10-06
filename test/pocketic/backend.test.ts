import { PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  // The frontend boots by calling getCallerUserRole; it must not trap on a
  // fresh canister with no domain logic.
  await expect(actor.getCallerUserRole()).resolves.toBeDefined();
});

it("reports the schema instead of trapping", async () => {
  await expect(actor.schema()).resolves.toBeTypeOf("string");
});

it("reports whether the caller is an admin instead of trapping", async () => {
  await expect(actor.isCallerAdmin()).resolves.toBeTypeOf("boolean");
});
