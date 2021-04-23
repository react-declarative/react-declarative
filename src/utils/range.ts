export const range = (start: number, end: number, length = end - start) =>
  Array.from({ length }, (_, i) => start + i);

export default range;
