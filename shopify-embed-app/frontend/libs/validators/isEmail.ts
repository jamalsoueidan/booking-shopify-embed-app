export default (error: string): ((input: string) => string | undefined) => {
  return (input: string) => {
    const filter =
      /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(input)) {
      return error;
    }
  };
};
