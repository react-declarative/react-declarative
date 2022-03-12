import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../../../../styles';

import TableRow from '@mui/material/TableRow';

import { useProps } from "../../PropProvider";

import CheckboxBodyCell from './common/CheckboxBodyCell';
import CommonBodyCell from './common/CommonBodyCell';

import IRowData from '../../../../../model/IRowData';
import IAnything from '../../../../../model/IAnything';

import useSelection from '../hooks/useSelection';

interface ILightBodyRowProps<RowData extends IRowData = IAnything> {
    row: RowData;
}

const useStyles = makeStyles({
    row: {
        position: 'relative',
    },
});

export const LightBodyRow = <RowData extends IRowData = IAnything>({
    row,
}: ILightBodyRowProps<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);

    const props = useProps<RowData>();
    const { selection } = useSelection();
    const classes = useStyles();

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
            className={classes.row}
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

export default LightBodyRow;
