import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '../../../../../styles';

import TableRow from '@mui/material/TableRow';

import CheckboxBodyCell from './common/CheckboxBodyCell';
import CommonBodyCell from './common/CommonBodyCell';

import IRowData from '../../../../../model/IRowData';
import IAnything from '../../../../../model/IAnything';

import useSelection from '../../../hooks/useSelection';
import useProps from '../.../../../../hooks/useProps';

interface IDesktopBodyRowProps<RowData extends IRowData = IAnything> {
    row: RowData;
}

const useStyles = makeStyles({
    noBottomBorder: {
        '& > *': {
            borderBottom: '0 !important',
        },
    },
});

export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
    row,
}: IDesktopBodyRowProps<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);
    const classes = useStyles();

    const props = useProps<RowData>();

    const { selection } = useSelection();

    const {
        onRowClick,
        onRowAction,
        columns = [],
    } = props;

    const handleClick = () => {
        if (!menuOpened) {
            onRowClick && onRowClick(row);
        }
    };

    const handleMenuToggle = (opened: boolean) => {
        setMenuOpened(opened);
    };

    const handleAction = (action: string) => {
        onRowAction && onRowAction(row, action);
    };

    return (
        <TableRow
            hover
            className={classes.noBottomBorder}
            onClick={handleClick}
            selected={selection.has(row.id)}
        >
            <CheckboxBodyCell<RowData> row={row} />
            {columns.map((column, idx) => (
                <CommonBodyCell<RowData>
                    column={column}
                    row={row}
                    key={idx}
                    onAction={handleAction}
                    onMenuToggle={handleMenuToggle}
                />
            ))}
        </TableRow>
    );
};

export default DesktopBodyRow;
