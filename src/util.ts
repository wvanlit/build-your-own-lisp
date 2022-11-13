export const assert = (condition: boolean) => {
  if (!condition) throw new Error("Assertion failed");
};

export const invalid = () => {
  throw new Error("Invalid program state");
};
