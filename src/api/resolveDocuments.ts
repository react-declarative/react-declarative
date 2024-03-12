/**
 * Resolves the documents from an async generator and returns them as a flattened array.
 *
 * @param iterator - The async generator to resolve documents from.
 * @returns - A promise that resolves to the flattened array of documents.
 */
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
