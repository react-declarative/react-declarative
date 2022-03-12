import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import { useProps } from '../PropProvider';

interface IParams<RowData extends IRowData = IAnything> {
    row: RowData;
}

export const useRowMark = <RowData extends IRowData = IAnything>({
    row,
}: IParams<RowData>) => {

    const [mark, setMark] = useState('');
    const isMountedRef = useRef(true);

    const { fallback, rowMark } = useProps();

    useEffect(() => {
        const processMark = async () => {
            try {
                if (typeof rowMark === 'function') {
                    let result: string | Promise<string> = rowMark(row);
                    result = result instanceof Promise ? (await result) : result;
                    isMountedRef.current && setMark(result);
                } else if (rowMark) {
                    isMountedRef.current && setMark(row[rowMark]);
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
            return;
        };
        processMark();
    }, [row, rowMark]);

    useLayoutEffect(() => () => {
        isMountedRef.current = false;
    }, []);

    return mark;
};

export default useRowMark;