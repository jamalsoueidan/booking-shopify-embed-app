export default (error: string): ((input: string) => string | undefined) => {
  return (input: string) => {
    const filter = /^(\+|\d)[0-9]{7,16}$/im;
    if (!filter.test(input)) {
      return error;
    }
  };
};
