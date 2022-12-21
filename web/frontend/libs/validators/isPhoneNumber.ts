export default (error: string): ((input: string) => string | undefined) => {
  return (input: string) => {
    const filter = /^[\+]?[(]?[\d]{3}[)]?[-\s\.]?[\d]{3}[-\s\.]?[\d]{4,6}$/im;
    if (!filter.test(input)) {
      return error;
    }
  };
};
