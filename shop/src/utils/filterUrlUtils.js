
// Helper to remove diacritics
export const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Custom encoder: escapes only delimiters and % to preserve structure and allow "pretty" UTF-8
export const customEncode = (str) => {
  return str
    .replace(/%/g, '%25') // Must be first
    .replace(/-/g, '%2D')
    .replace(/\//g, '%2F')
    .replace(/,/g, '%2C');
};

const customDecode = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    // Fallback if malformed
    return str;
  }
};

export const serializeFilters = (selectedFilters, filterParameters) => {
  if (!selectedFilters || !filterParameters) return '';

  const parts = [];

  // Iterate over selected filter keys (param IDs)
  Object.keys(selectedFilters).forEach((paramId) => {
    const valueIds = selectedFilters[paramId];
    if (!valueIds || valueIds.length === 0) return;

    // Find the parameter definition
    const param = filterParameters.find((p) => String(p.id) === String(paramId));
    if (!param) return;

    // Find the value names
    const valueNames = valueIds
      .map((valId) => {
        const val = param.values.find((v) => String(v.id) === String(valId));
        return val ? val.name : null;
      })
      .filter((name) => name !== null);

    if (valueNames.length === 0) return;

    // Encode key (remove diacritics first)
    const encodedKey = customEncode(removeDiacritics(param.name));

    // Encode values and join (remove diacritics first)
    const encodedValues = valueNames
      .map((name) => customEncode(removeDiacritics(name)))
      .join(',');

    parts.push(`${encodedKey}-${encodedValues}`);
  });

  return parts.join('/');
};

export const parseFilters = (q, filterParameters) => {
  if (!q || !filterParameters) return {};

  const selectedFilters = {};

  // Split by '/' to get Key-Values groups
  const parts = q.split('/');

  parts.forEach((part) => {
    // Split by first '-' to separate Key and Values
    const separatorIndex = part.indexOf('-');
    if (separatorIndex === -1) return;

    const encodedKey = part.substring(0, separatorIndex);
    const encodedValuesStr = part.substring(separatorIndex + 1);

    if (!encodedKey || !encodedValuesStr) return;

    // Decode Key
    const keyName = customDecode(encodedKey);
    const normalizedKeyName = keyName.toLowerCase();

    // Find parameter by name (case-insensitive and diacritic-agnostic)
    const param = filterParameters.find(
      (p) => removeDiacritics(p.name).toLowerCase() === normalizedKeyName
    );

    if (!param) return;

    // Split values by ','
    const encodedValues = encodedValuesStr.split(',');
    const valueIds = [];

    encodedValues.forEach((encodedVal) => {
      const valName = customDecode(encodedVal);
      const normalizedValName = valName.toLowerCase();

      // Find value by name
      const val = param.values.find(
        (v) => removeDiacritics(v.name).toLowerCase() === normalizedValName
      );
      if (val) {
        valueIds.push(val.id);
      }
    });

    if (valueIds.length > 0) {
      selectedFilters[param.id] = valueIds;
    }
  });

  return selectedFilters;
};
