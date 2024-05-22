import IRowData, { RowId } from "../model/IRowData";

export const iterateUnion = <T extends IRowData = IRowData>(iterators: AsyncGenerator<T | T[], void, unknown>[]) =>
    async function* (limit: number, offset: number) {
        const duplicateSet = new Set<RowId>();
        for (const iterator of iterators) {
            for await (const chunk of iterator) {
                const rows = [chunk].flatMap(v => v);
                for (const row of rows) {
                    if (duplicateSet.has(row.id)) {
                        continue;
                    }
                    if (offset > 0) {
                        offset -= 1;
                        continue;
                    }
                    if (limit > 0) {
                        duplicateSet.add(row.id);
                        yield row;
                        limit -= 1;
                        continue;
                    }
                }
            }
        }
    };

export default iterateUnion;
