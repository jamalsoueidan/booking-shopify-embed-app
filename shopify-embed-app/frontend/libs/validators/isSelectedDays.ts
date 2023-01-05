export default (error: string): ((input: string[]) => string | undefined) => {
  return (input: string[]) => {
    if (input.length <= 0) {
      return error;
    }
  };
};
