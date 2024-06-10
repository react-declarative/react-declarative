/**
 * Maps the documents from an async generator and yield them
 *
 * @param iterator - The async generator to resolve documents from.
 * @returns - A promise that resolves to the flattened array of documents.
 */
export async function* mapDocuments<T extends unknown, U = T>(
    iterator: AsyncGenerator<T | T[], void, unknown>,
    callbackfn: (value: T) => U | Promise<U>
) {
    for await (const chunk of iterator) {
        const rows = [chunk].flatMap(v => v);
        for (const row of rows) {
            yield await callbackfn(row);
        }
    }
};

export default mapDocuments;
