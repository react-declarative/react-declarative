import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from '../../../../../../../styles';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

import IRowData from '../../../../../../../model/IRowData';
import IAnything from '../../../../../../../model/IAnything';

import DisplayMode from '../../../../../../../model/DisplayMode';

import useProps from '../../../../../hooks/useProps';
import useExpansion from '../../../../../hooks/useExpansion';
import useSelection from '../../../../../hooks/useSelection';

interface IExpansionRowProps<RowData extends IRowData = IAnything> {
    row: RowData;
    mode: DisplayMode;
}

const useStyles = makeStyles({
    root: {
        padding: '0 !important',
        borderTop: 'none !important',
    },
    container: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        height: '100%',
        width: '100%',
    },
    content: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        '& > *': {
            flex: 1,
        },
        flex: 1,
    },
});

export const ExpansionRow = <RowData extends IRowData = IAnything> ({
    row,
}: IExpansionRowProps<RowData>) => {
    const classes = useStyles();
    const { columns, ExpansionContent = () => <Fragment /> } = useProps<RowData>();
    const { selection } = useSelection()
    const { expansion } = useExpansion();
    const opened = expansion.has(row.id);
    return (
        <TableRow selected={selection.has(row.id)}>
            <TableCell className={classes.root} colSpan={columns.length + 1 || 1} padding="none">
                <Box className={classes.container}>
                    <Collapse className={classes.content} in={opened}>
                        <ExpansionContent
                            {...row}
                        />
                    </Collapse>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default ExpansionRow;
