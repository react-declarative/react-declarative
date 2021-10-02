import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';

interface IRowMarkProps {
    rows: any[];
    rowId: string;
    rowColor: string | ((row: any) => string);
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
    rowColor,
    rowId,
    rows,
}: IRowMarkProps) => {
    const classes = useStyles();


    const getRow = (id: string) => rows.find((row) => row.id === id);

    const getRowColor = (id: string) => {
        const row = getRow(id);
        if (row && rowColor) {
            return typeof rowColor === 'string'
                ? row[rowColor]
                : rowColor(row);
        } else {
            return 'unset';
        }
    };

    const background = getRowColor(rowId);

    return (
        <Box
            className={classes.mark}
            style={{ background }}
        />
    );
};

export default RowMark;
