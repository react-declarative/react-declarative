import IRowData, { RowId } from "../model/IRowData";

/**
 * Resolves the documents from an async generator and distincts them.
 *
 * @param iterator - The async generator to resolve documents from.
 * @returns - A promise that resolves to the flattened array of documents.
 */
export async function* distinctDocuments<T extends IRowData>(
    iterator: AsyncGenerator<T | T[], void, unknown>,
){
    const duplicateSet = new Set<RowId>();
    for await (const chunk of iterator) {
        const rows = [chunk].flatMap(v => v);
        for (const row of rows) {
            if (!duplicateSet.has(row.id)) {
                duplicateSet.add(row.id);
                yield row;
            }
        }
    }
};

export default distinctDocuments;
