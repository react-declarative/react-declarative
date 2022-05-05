import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';

import IRowData from '../../../../../../model/IRowData';
import IAnything from '../../../../../../model/IAnything';

import SelectionMode from '../../../../../../model/SelectionMode';

import useToggleHandler from '../../../../hooks/useToggleHandler';
import useSelection from '../../../../hooks/useSelection';
import useRowMark from '../../../../hooks/useRowMark';
import useProps from '../../../../hooks/useProps';

export interface ICheckboxCellProps<RowData extends IRowData = IAnything> {
    row: RowData;
}

const useStyles = makeStyles({
    root: {
        position: 'relative',
    },
    mark: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
    },
    avatar: {
        marginLeft: 2,
        height: '32px !important',
        width: '32px !important',
    }
});

export const CheckboxCell = <RowData extends IRowData = IAnything>({
    row,
}: ICheckboxCellProps<RowData>) => {

    const classes = useStyles();

    const { selection } = useSelection();

    const mark = useRowMark({ row });

    const props = useProps<RowData>();

    const {
        selectionMode = SelectionMode.None,
        rowMark,
    } = props;

    const createToggleHandler = useToggleHandler(row);

    const renderCheckbox = () => {
        if (selectionMode === SelectionMode.Single) {
            return (
                <Radio
                    color="primary"
                    onClick={createToggleHandler(true)}
                    checked={selection.has(row.id)}
                />
            );
        } else if (selectionMode === SelectionMode.Multiple) {
            return (
                <Checkbox
                    color="primary"
                    onClick={createToggleHandler(false)}
                    checked={selection.has(row.id)}
                />
            );
        } else if (selectionMode === SelectionMode.None) {
            return (
                <Checkbox
                    color="primary"
                    disabled
                />
            );
        } else {
            return null;
        }
    };

    return (
        <TableCell className={classes.root} padding="checkbox">
            {rowMark && (
                <Box
                    className={classes.mark}
                    style={{ background: mark }}
                />
            )}
            {renderCheckbox()}
        </TableCell>
    );
};

export default CheckboxCell;
