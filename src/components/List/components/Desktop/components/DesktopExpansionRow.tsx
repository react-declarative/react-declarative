import * as React from 'react';
import { Fragment } from 'react';

import { makeStyles } from '../../../../../styles';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

import IRowData from '../../../../../model/IRowData';
import IAnything from '../../../../../model/IAnything';

import useProps from '../../../hooks/useProps';
import useExpansion from '../../../hooks/useExpansion';

interface IDesktopExpansionRowProps<RowData extends IRowData = IAnything> {
    row: RowData;
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

export const DesktopExpansionRow = <RowData extends IRowData = IAnything> ({
    row,
}: IDesktopExpansionRowProps<RowData>) => {
    const classes = useStyles();
    const { columns, ExpansionContent = () => <Fragment /> } = useProps<RowData>();
    const { expansion } = useExpansion();
    const opened = expansion.has(row.id);
    return (
        <TableRow>
            <TableCell className={classes.root} colSpan={columns.length + 1 || 1}>
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

export default DesktopExpansionRow;
