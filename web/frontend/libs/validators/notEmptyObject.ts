export const notEmptyObject = (
  error: string
): ((input: any) => string | undefined) => {
  return (input: any) => {
    const foundError = Object.keys(input).some((k) => !input[k]);
    if (foundError) {
      return error;
    }
    return undefined;
  };
};
