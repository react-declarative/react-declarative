export const iterateUnion = <T extends unknown>(iterators: AsyncGenerator<T | T[], void, unknown>[]) =>
    async function* (limit: number, offset: number) {
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
    };

export default iterateUnion;
