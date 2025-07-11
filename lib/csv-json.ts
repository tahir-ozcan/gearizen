import Papa from "papaparse";

export interface CsvJsonOptions {
  delimiter?: string;
  header?: boolean; // treat first row as header when converting CSV to JSON
}

export function csvToJson(csv: string, options: CsvJsonOptions = {}): any[] {
  const { delimiter = ",", header = true } = options;
  if (!csv.trim()) return [];
  const result = Papa.parse(csv.trim(), {
    header,
    skipEmptyLines: true,
    delimiter,
  });
  if (result.errors.length) {
    throw new Error(result.errors[0].message);
  }
  return result.data as any[];
}

export function jsonToCsv(data: any[], options: CsvJsonOptions = {}): string {
  const { delimiter = ",", header = true } = options;
  return (
    Papa.unparse(data, { delimiter, header, newline: "\n" }) as string
  ).trimEnd();
}
