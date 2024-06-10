/**
 * Filters the documents from an async generator and yield them by the condition
 *
 * @param iterator - The async generator to resolve documents from.
 * @returns - A promise that resolves to the flattened array of documents.
 */
export async function* filterDocuments<T extends unknown>(
    iterator: AsyncGenerator<T | T[], void, unknown>,
    predicate: (value: T) => boolean | Promise<boolean>
) {
    for await (const chunk of iterator) {
        const rows = [chunk].flatMap(v => v);
        for (const row of rows) {
            if (await predicate(row)) {
                yield row;
            }
        }
    }
};

export default filterDocuments;
