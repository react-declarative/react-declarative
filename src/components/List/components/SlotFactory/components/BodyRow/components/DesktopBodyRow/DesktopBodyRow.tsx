import * as React from 'react';
import { useMemo, useState } from 'react';
import { makeStyles } from '../../../../../../../../styles';

import TableRow from '@mui/material/TableRow';

import CheckboxBodyCell from './DesktopCheckboxBodyCell';
import CommonBodyCell from './DesktopCommonCell';

import IRowData from '../../../../../../../../model/IRowData';
import IAnything from '../../../../../../../../model/IAnything';

import { IBodyRowSlot, BodyColumn } from '../../../../../../slots/BodyRowSlot';

import useProps from '../../../../../../hooks/useProps';
import useReload from '../../../../../../hooks/useReload';
import useSelection from '../../../../../../hooks/useSelection';

const useStyles = makeStyles()({
    root: {
    },
});

export const DesktopBodyRow = <RowData extends IRowData = IAnything>({
    row,
    mode,
    columns,
    fullWidth,
}: IBodyRowSlot<RowData>) => {

    const [menuOpened, setMenuOpened] = useState(false);
    const { classes } = useStyles();

    const props = useProps<RowData>();
    const reload = useReload();

    const { selection } = useSelection();

    const {
        onRowClick,
        onRowAction,
    } = props;

    const handleClick = () => {
        if (!menuOpened) {
            onRowClick && onRowClick(row, reload);
        }
    };

    const handleMenuToggle = (opened: boolean) => {
        setMenuOpened(opened);
    };

    const handleAction = (action: string) => {
        onRowAction && onRowAction(action, row, reload);
    };

    const content = useMemo(() => {

        const renderColumn = (column: BodyColumn, idx: number) => (
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
    
        const content = columns.map(renderColumn);

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
