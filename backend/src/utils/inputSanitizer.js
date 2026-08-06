export function formatForCP(rawInput, type = 'RAW') {
  const raw = String(rawInput ?? '').trim();

  if (type === 'ARRAY') {
    // Mode: [1,2,3], 10 → 3 1 2 3 10
    // Extract first array part, count elements, prepend count
    const firstArrayMatch = raw.match(/\[([^\]]*)\]/);
    if (!firstArrayMatch) {
      return raw.replace(/[\[\],]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const arrayElements = firstArrayMatch[1].split(',').map((s) => s.trim()).filter((s) => s);
    const elementCount = arrayElements.length;
    const afterArray = raw.substring(firstArrayMatch[0].length).trim();
    const restPart = afterArray
      .replace(/^,\s*/, '')
      .replace(/[\[\],]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return `${elementCount} ${arrayElements.join(' ')}${restPart ? ` ${restPart}` : ''}`;
  }

  if (type === 'MATRIX') {
    // Mode: [[1,2],[3,4]] → 2 2 1 2 3 4
    // Count rows and columns, then flatten
    const rows = raw.match(/\[([^\[\]]+)\]/g) || [];
    const rowCount = rows.length;

    if (rowCount === 0) {
      return raw.replace(/[\[\],]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const firstRowElements = rows[0]
      .replace(/[\[\]]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    const colCount = firstRowElements.length;

    const allElements = raw
      .replace(/[\[\]]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    return `${rowCount} ${colCount} ${allElements.join(' ')}`;
  }

  // Mode: RAW (default)
  return raw.replace(/["']/g, '').trim();
}

export function cleanInputForSeeding(input, type = 'RAW') {
  return formatForCP(input, type);
}
