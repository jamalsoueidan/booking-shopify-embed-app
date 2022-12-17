export const beginningOfDay = (date: Date) => {
  return new Date(`${date.toISOString().substring(0, 10)}T00:00:00.0Z`);
};

export const closeOfDay = (date: Date) => {
  return new Date(`${date.toISOString().substring(0, 10)}T23:59:59.0Z`);
};
