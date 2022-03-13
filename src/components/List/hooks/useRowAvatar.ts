import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { ListAvatar } from '../../../model/IListProps';
import IAnything from '../../../model/IAnything';
import IRowData from '../../../model/IRowData';

import { useProps } from '../hooks/useProps';

interface IParams<RowData extends IRowData = IAnything> {
    row: RowData;
}

export const useRowAvatar = <RowData extends IRowData = IAnything>({
    row,
}: IParams<RowData>) => {

    const [avatar, setAvatar] = useState<ListAvatar | null>(null);
    const isMountedRef = useRef(true);

    const { fallback, rowAvatar } = useProps();

    useEffect(() => {
        const processAvatar = async () => {
            try {
                if (typeof rowAvatar === 'function') {
                    let result: ListAvatar | Promise<ListAvatar> | string = rowAvatar(row);
                    result = result instanceof Promise ? (await result) : result;
                    isMountedRef.current && setAvatar(typeof result === 'string' ? {
                        src: result,
                        alt: result,
                    } : result);
                } else if (typeof rowAvatar === 'string') {
                    isMountedRef.current && setAvatar({
                        src: row[rowAvatar] || '',
                        alt: row[rowAvatar] || '',
                    });
                } else if (rowAvatar) {
                    isMountedRef.current && setAvatar({
                        src: rowAvatar.src ? row[rowAvatar.src] : '',
                        alt: rowAvatar.alt ? row[rowAvatar.alt] : '',
                    });
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
            return;
        };
        processAvatar();
    }, [row, rowAvatar]);

    useLayoutEffect(() => () => {
        isMountedRef.current = false;
    }, []);

    return avatar;
};

export default useRowAvatar;