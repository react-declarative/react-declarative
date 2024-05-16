import IRowData from "../model/IRowData";

export async function* iteratePromise<T extends IRowData = IRowData>(fn: () => Promise<T[]>) {
    for (const row of await fn()) {
        yield row;
    }
};

export default iteratePromise;
