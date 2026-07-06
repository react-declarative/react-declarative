import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import { useArrayPaginator } from "../components/List";
import { ListHandler, ListHandlerChips, ListHandlerPagination } from "../model/IListProps";

type ListHandlerFn = Exclude<ListHandler, any[]>;

let div: HTMLDivElement;

beforeEach(() => {
    div = document.createElement('div');
});

afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
});

const renderPaginator = async (rows: any[]) => {
    const ref: { handler?: ListHandler } = {};
    const Capture = () => {
        ref.handler = useArrayPaginator(rows);
        return null;
    };
    await act(async () => {
        ReactDOM.render(<Capture />, div);
    });
    const handler = ref.handler as ListHandlerFn;
    return async (pagination: ListHandlerPagination, chips: ListHandlerChips = {}) =>
        await handler({}, pagination, [], chips, "", {}) as { rows: any[]; total: number | null };
};

describe('useArrayPaginator', () => {

    const rows = [...new Array(10)].map((_, idx) => ({
        id: idx,
        name: `row-${idx}`,
        even: idx % 2 === 0,
        third: idx % 3 === 0,
    }));

    test('Expect first page to be returned as-is', async () => {
        const request = await renderPaginator(rows);
        const result = await request({ limit: 10, offset: 0 });
        expect(result.rows.length).toBe(10);
        expect(result.total).toBe(10);
    });

    test('Expect page after the last one to be empty, not a duplicate', async () => {
        const request = await renderPaginator(rows);
        const result = await request({ limit: 10, offset: 10 });
        expect(result.rows.length).toBe(0);
    });

    test('Expect partial last page to respect offset', async () => {
        const request = await renderPaginator(rows);
        const result = await request({ limit: 6, offset: 6 });
        expect(result.rows.map(({ id }: any) => id)).toEqual([6, 7, 8, 9]);
    });

    test('Expect rows matching multiple chips to not duplicate', async () => {
        const request = await renderPaginator(rows);
        const result = await request({ limit: 25, offset: 0 }, { even: true, third: true });
        const ids = result.rows.map(({ id }: any) => id);
        // id=0 и id=6 подходят под оба чипа — не должны задваиваться
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toContain(0);
        expect(ids).toContain(3);
        expect(ids).toContain(2);
    });

});
