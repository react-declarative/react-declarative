import * as React from 'react';
import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import IListProps, { ListAvatar } from '../../../../model/IListProps';

import MatAvatar from '@material-ui/core/Avatar';

interface IRowAvatarProps {
    rows: any[];
    rowId: string;
    rowAvatar: IListProps<any>['rowAvatar'];
}

const useStyles = makeStyles({
    avatar: {
        borderRadius: 3,
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

    const getRowAvatar = useCallback(async (id: string) => {
        const row = rows.find((row) => row.id === id);
        if (row && rowAvatar) {
            if (typeof rowAvatar === 'function') {
                let result: ListAvatar | Promise<ListAvatar> = rowAvatar(row);
                result = result instanceof Promise ? (await result) : result;
                return result;
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
                console.warn(e);
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
