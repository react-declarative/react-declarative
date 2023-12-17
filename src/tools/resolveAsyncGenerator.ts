export const resolveAsyncGenerator = async <T extends unknown>(
  iterator: AsyncGenerator<T, void, unknown>
) => {
  const result: T[] = [];
  for await (const item of iterator) {
    result.push(item);
  }
  return result;
};

export default resolveAsyncGenerator;
