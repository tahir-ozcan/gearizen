import "@testing-library/jest-dom";

if (typeof globalThis.crypto === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { webcrypto } = require("crypto");
  // @ts-ignore
  globalThis.crypto = webcrypto;
}
