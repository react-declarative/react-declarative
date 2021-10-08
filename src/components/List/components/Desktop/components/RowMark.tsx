import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import IListProps from '../../../../../model/IListProps';

import Box from '@material-ui/core/Box';

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

    const getRow = (id: string) => rows.find((row) => row.id === id);

    const getRowMark = (id: string) => {
        const row = getRow(id);
        if (row && rowMark) {
            return typeof rowMark === 'string'
                ? row[rowMark]
                : rowMark(row);
        } else {
            return 'unset';
        }
    };

    const background = getRowMark(rowId);

    return (
        <Box
            className={classes.mark}
            style={{ background }}
        />
    );
};

export default RowMark;
