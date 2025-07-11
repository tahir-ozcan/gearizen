export function jsonToCsv(data: unknown[], delimiter = ','): string {
  if (!Array.isArray(data) || data.length === 0) return '';

  const keys = Object.keys(data[0] as Record<string, unknown>);
  const rows = [keys.join(delimiter)];

  for (const item of data) {
    const row = keys.map((key) => {
      const val = (item as Record<string, unknown>)[key];
      if (val === null || val === undefined) return '';
      const str = String(val);
      const needsQuote = str.includes('"') || str.includes(delimiter) || str.includes('\n');
      return needsQuote ? '"' + str.replace(/"/g, '""') + '"' : str;
    });
    rows.push(row.join(delimiter));
  }

  return rows.join('\n');
}
