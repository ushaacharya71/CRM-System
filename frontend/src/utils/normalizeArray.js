export const normalizeArray = (...values) => {
  for (const v of values) {
    if (Array.isArray(v)) return v;
  }
  return [];
};
