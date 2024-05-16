import IRowData from "../model/IRowData";

export async function* iterateList<T extends IRowData = IRowData>(rows: T[], map = (row: T) => Promise.resolve(row)) {
    for (const row of rows) {
        yield await map(row);
    }
};

export default iterateList;
