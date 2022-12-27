export const sortStrings = (key: string) => (a: any, b: any) => {
  return a[key] > b[key] ? 1 : -1;
};
