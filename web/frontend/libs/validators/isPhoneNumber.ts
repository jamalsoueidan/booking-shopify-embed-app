export default (error: string): ((input: string) => string | undefined) => {
  return (input: string) => {
    const filter = /^(\+|\d)[\d]{7,16}$/im;
    if (!filter.test(input)) {
      return error;
    }
  };
};
