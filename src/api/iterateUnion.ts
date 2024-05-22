import IRowData, { RowId } from "../model/IRowData";

async function* makeIterator<T extends IRowData = IRowData>(
    iterators: AsyncGenerator<T | T[], void, unknown>[],
    limit: number,
    offset: number,
) {
    for (const iterator of iterators) {
        for await (const chunk of iterator) {
            const rows = [chunk].flatMap(v => v);
            for (const row of rows) {
                if (offset > 0) {
                    offset -= 1;
                    continue;
                }
                if (limit > 0) {
                    yield row;
                    limit -= 1;
                    continue;
                }
            }
        }
    }
}

export const iterateUnion = <T extends IRowData = IRowData>(iterators: AsyncGenerator<T | T[], void, unknown>[]) =>
    async function* (limit: number, offset: number) {
        const duplicateSet = new Set<RowId>();
        for await (const row of makeIterator(iterators, limit, offset)) {
            if (duplicateSet.has(row.id)) {
                continue;
            }
            duplicateSet.add(row.id);
            yield row;
        }
    };

export default iterateUnion;
