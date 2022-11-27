export default (error: string): ((input: string) => string | undefined) => {
  return (input: string) => {
    const filter =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!filter.test(input)) {
      return error;
    }
  };
};
