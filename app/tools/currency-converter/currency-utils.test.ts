import { test } from "uvu";
import * as assert from "uvu/assert";
import { fetchRates, calcResult } from "./currency-utils";

// mock fetch for tests
let lastUrl = "";
// @ts-expect-error mock fetch for Node
global.fetch = (url: string) => {
  lastUrl = url;
  return Promise.resolve({
    ok: true,
    json: async () => ({ success: true, rates: { EUR: 0.5 } }),
  });
};

test("fetchRates calls API with base", async () => {
  const rates = await fetchRates("USD");
  assert.is(lastUrl.includes("base=USD"), true);
  assert.is(rates.EUR, 0.5);
});

test("calcResult multiplies", () => {
  assert.is(calcResult(2, 0.5), "1.0000");
});

test.run();
