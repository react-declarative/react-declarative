import * as React from 'react';
import { useState, useLayoutEffect, useCallback, useRef } from 'react';

import { makeStyles } from '../../../../styles';

import IListProps from '../../../../model/IListProps';

import { useProps } from '../PropProvider';

import Box from '@mui/material/Box';

interface IRowMarkProps {
    rows: any[];
    rowId: string;
    rowMark: IListProps<any>['rowMark'];
}

const useStyles = makeStyles({
    mark: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
    },
});

const RowMark = ({
    rowMark,
    rowId,
    rows,
}: IRowMarkProps) => {
    const classes = useStyles();
    const mountedRef = useRef(true);
    const [background, setBackground] = useState('');
    const { fallback } = useProps();

    const getRowMark = useCallback(async (id: string) => {
        const getRow = (id: string) => rows.find((row) => row.id === id);
        const row = getRow(id);
        if (row && rowMark) {
            if (typeof rowMark === 'function') {
                let result: string | Promise<string> = rowMark(row);
                result = result instanceof Promise ? (await result) : result;
                return result;
            } else {
                return row[rowMark];
            }
        } else {
            return 'unset';
        }
    }, [rows, rowMark]);

    useLayoutEffect(() => {
        (async () => {
            try {
                const background = await getRowMark(rowId);
                if (mountedRef.current) {
                    setBackground(background);
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
        })();
    }, [rowId, getRowMark]);

    useLayoutEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return (
        <Box
            className={classes.mark}
            style={{ background }}
        />
    );
};

export default RowMark;
