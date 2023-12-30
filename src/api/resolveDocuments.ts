export const resolveDocuments = async <T extends unknown>(
  iterator: AsyncGenerator<T | T[], void, unknown>
) => {
  const result: (T | T[])[] = [];
  for await (const item of iterator) {
    result.push(item);
  }
  return result.flatMap(v => v);
};

export default resolveDocuments;
