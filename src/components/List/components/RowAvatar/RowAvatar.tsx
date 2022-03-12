import * as React from 'react';
import { useState, useLayoutEffect, useCallback, useRef } from 'react';

import { makeStyles } from '../../../../styles';

import IListProps, { ListAvatar } from '../../../../model/IListProps';

import { useProps } from '../PropProvider';

import MatAvatar from '@mui/material/Avatar';

interface IRowAvatarProps {
    rows: any[];
    rowId: string;
    rowAvatar: IListProps<any>['rowAvatar'];
}

const useStyles = makeStyles({
    avatar: {
        border: '2.5px solid transparent',
        height: 24,
        width: 24,
    },
});

const RowAvatar = ({
    rowAvatar,
    rowId,
    rows,
}: IRowAvatarProps) => {
    const classes = useStyles();
    const mountedRef = useRef(true);
    const [avatar, setAvatar] = useState<ListAvatar | null>(null);
    const { fallback } = useProps();

    const getRowAvatar = useCallback(async (id: string) => {
        const row = rows.find((row) => row.id === id);
        if (row && rowAvatar) {
            if (typeof rowAvatar === 'function') {
                let result: ListAvatar | Promise<ListAvatar> | string = rowAvatar(row);
                result = result instanceof Promise ? (await result) : result;
                return typeof result === 'string' ? { 
                    src: result,
                    alt: result,
                } : result;
            } else if (typeof rowAvatar === 'string') {
                return {
                    src: row[rowAvatar] || '',
                    alt: row[rowAvatar] || '',
                };
            } else {
                return {
                    src: rowAvatar.src ? row[rowAvatar.src] : '',
                    alt: rowAvatar.alt ? row[rowAvatar.alt] : '',
                };
            }
        } else {
            return {
                src: '',
                alt: '',
            };
        }
    }, [rowAvatar, rows]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const newAvatar = await getRowAvatar(rowId);
                if (mountedRef.current) {
                    setAvatar(newAvatar);
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
        })();
    }, [rowId, getRowAvatar]);

    useLayoutEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return avatar ? (
        <MatAvatar
            className={classes.avatar}
            {...avatar}
        />
    ) : null;
};

export default RowAvatar;
