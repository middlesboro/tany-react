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

    // Encode key
    const encodedKey = encodeURIComponent(param.name).replace(/%20/g, '+');

    // Encode values and join
    const encodedValues = valueNames
      .map((name) => encodeURIComponent(name).replace(/%20/g, '+'))
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
    const keyName = decodeURIComponent(encodedKey.replace(/\+/g, '%20'));

    // Find parameter by name (case-insensitive to be robust)
    const param = filterParameters.find(
      (p) => p.name.toLowerCase() === keyName.toLowerCase()
    );

    if (!param) return;

    // Split values by ','
    const encodedValues = encodedValuesStr.split(',');
    const valueIds = [];

    encodedValues.forEach((encodedVal) => {
      const valName = decodeURIComponent(encodedVal.replace(/\+/g, '%20'));
      // Find value by name
      const val = param.values.find(
        (v) => v.name.toLowerCase() === valName.toLowerCase()
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
