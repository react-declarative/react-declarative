import * as React from 'react';

import TableCell from '@mui/material/TableCell';

import { makeStyles } from '../../../../../../../../styles';

import CommonCellSlot, { ICommonCellSlot } from '../../../../../../slots/CommonCellSlot';

import ColumnType from '../../../../../../../../model/ColumnType';

const useStyles = makeStyles({
    root: {
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        overflowWrap: 'break-word',
    },
});

export const DesktopCommonCell = (props: ICommonCellSlot) => {

    const classes = useStyles();

    const { column } = props;

    const padding = column.type === ColumnType.Component ? 'none'
        : column.type === ColumnType.CheckBox ? 'checkbox'
        : 'normal';

    const align = column.type === ColumnType.Action ? 'center' : 'left';

    const minWidth = column.width;
    const maxWidth = minWidth;

    return (
        <TableCell
            className={classes.root}
            style={{ minWidth, maxWidth }}
            align={align}
            padding={padding}
        >
            <CommonCellSlot
                {...props}
            />
        </TableCell>
    );
};

export default DesktopCommonCell;
