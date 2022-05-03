import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '../../../../../../../styles';

import TableRow from '@mui/material/TableRow';

import CheckboxBodyCell from '../common/CheckboxBodyCell';
import CommonBodyCell from '../common/CommonBodyCell';

import computeHidden from '../../helpers/computeHidden';

import IRowData from '../../../../../../../model/IRowData';
import IAnything from '../../../../../../../model/IAnything';

import DisplayMode from '../../../../../../../model/DisplayMode';

import useProps from '../.../../../../../../hooks/useProps';
import useSelection from '../../../../../hooks/useSelection';

interface IBodyRowProps<RowData extends IRowData = IAnything> {
    row: RowData;
    fullWidth: number;
    mode: DisplayMode;
}

const useStyles = makeStyles({
    noBottomBorder: {
        '& > *': {
            borderBottom: '0 !important',
        },
    },
});

export const BodyRow = <RowData extends IRowData = IAnything>({
    row,
    mode,
    fullWidth,
}: IBodyRowProps<RowData>) => {

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
            className={classes.noBottomBorder}
            selected={selection.has(row.id)}
            onClick={handleClick}
        >
            <CheckboxBodyCell<RowData> row={row} />
            {columns.filter((column, idx) => computeHidden({
                column,
                mode,
                idx,
            })).map((column, idx) => (
                <CommonBodyCell<RowData>
                    column={column}
                    row={row}
                    key={idx}
                    idx={idx}
                    mode={mode}
                    fullWidth={fullWidth}
                    onAction={handleAction}
                    onMenuToggle={handleMenuToggle}
                />
            ))}
        </TableRow>
    );
};

export default BodyRow;
