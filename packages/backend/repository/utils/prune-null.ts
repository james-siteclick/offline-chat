// @todo investigate if possible in PG driver
export function pruneNull(obj: Record<string, unknown>) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value !== null && { [key]: value }),
    }),
    {}
  );
}
