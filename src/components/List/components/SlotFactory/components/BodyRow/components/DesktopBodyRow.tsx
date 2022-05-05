import * as React from 'react';
import { useMemo, useState } from 'react';
import { makeStyles } from '../../../../../../../styles';

import TableRow from '@mui/material/TableRow';

import CheckboxBodyCell from '../../../../../slots/CheckboxCellSlot';
import CommonBodyCell from '../../../../../slots/CommonCellSlot';

import sortColumns from '../../../../../helpers/sortColumns';

import IColumn from '../../../../../../../model/IColumn';
import IRowData from '../../../../../../../model/IRowData';
import IAnything from '../../../../../../../model/IAnything';

import { IBodyRowSlot } from '../../../../../slots/BodyRowSlot';

import useProps from '../../../../../hooks/useProps';
import useSelection from '../../../../../hooks/useSelection';

const useStyles = makeStyles({
    root: {
    },
});

export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
    row,
    mode,
    fullWidth,
}: IBodyRowSlot<RowData>) => {

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

    const content = useMemo(() => {

        const renderColumn = (column: IColumn, idx: number) => (
            <CommonBodyCell
                column={column}
                row={row}
                key={idx}
                idx={idx}
                mode={mode}
                fullWidth={fullWidth}
                onAction={handleAction}
                onMenuToggle={handleMenuToggle}
            />
        );
    
        const content = sortColumns({
            mode,
            columns,
            fullWidth,
        }).map(renderColumn);

        return content;

    }, [fullWidth]);

    return (
        <TableRow
            className={classes.root}
            selected={selection.has(row.id)}
            onClick={handleClick}
        >
            <CheckboxBodyCell row={row} />
            {content}
        </TableRow>
    );
};

export default DesktopBodyRow;
