import { csvToJson, jsonToCsv } from "../lib/csv-json";

describe("csv-json utils", () => {
  test("csv to json roundtrip", () => {
    const csv = "name,age\nAlice,30\nBob,25";
    const json = csvToJson(csv);
    expect(json).toEqual([
      { name: "Alice", age: "30" },
      { name: "Bob", age: "25" },
    ]);
    expect(jsonToCsv(json).trim()).toBe(csv);
  });
});
