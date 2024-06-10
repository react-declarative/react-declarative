import pickDocuments from "./pickDocuments";

/**
 * Resolves the documents from an async generator and paginates them.
 *
 * @param iterator - The async generator to resolve documents from.
 * @returns - A promise that resolves to the flattened array of documents.
 */
export const paginateDocuments = async <T extends unknown>(
    iterator: AsyncGenerator<T | T[], void, unknown>,
    limit: number,
    offset: number,
) => {
    const iter = pickDocuments<T>(limit, offset);
    for await (const chunk of iterator) {
        const rows = [chunk].flatMap(v => v);
        if (iter(rows).done) {
            break;
        }
    }
    return iter().rows;
};

export default paginateDocuments;
