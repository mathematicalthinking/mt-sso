export const isNonEmptyString = (
  val: unknown,
  doTrimBeforeEval = false,
): boolean => {
  if (typeof val !== 'string') {
    return false;
  }
  return doTrimBeforeEval === false ? val.length > 0 : val.trim().length > 0;
};
