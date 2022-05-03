import * as React from 'react';

import { makeStyles } from '../../../../../../../styles';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableCell from '@mui/material/TableCell';

import IRowData from '../../../../../../../model/IRowData';
import IAnything from '../../../../../../../model/IAnything';

import SelectionMode from '../../../../../../../model/SelectionMode';

import useToggleHandler from '../../../../../hooks/useToggleHandler';
import useSelection from '../../../../../hooks/useSelection';
import useRowAvatar from '../../../../../hooks/useRowAvatar';
import useProps from '../.../../../../../../hooks/useProps';
import useRowMark from '../../../../../hooks/useRowMark';

import CheckboxExpander from './CheckboxExpander';

interface ICheckboxBodyCellProps<RowData extends IRowData = IAnything> {
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

export const CheckboxBodyCell = <RowData extends IRowData = IAnything>({
    row,
}: ICheckboxBodyCellProps<RowData>) => {

    const classes = useStyles();

    const { selection } = useSelection();

    const avatar = useRowAvatar({ row });
    const mark = useRowMark({ row });

    const props = useProps<RowData>();

    const {
        selectionMode = SelectionMode.None,
        rowAvatar,
        rowMark,
    } = props;

    const createToggleHandler = useToggleHandler(row);

    const renderCheckbox = () => {
        if (rowAvatar && avatar) {
            return (
                <Avatar
                    className={classes.avatar}
                    src={avatar.src}
                    alt={avatar.alt}
                />
            );
        } else if (selectionMode === SelectionMode.Single) {
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
        } else if (selectionMode === SelectionMode.Expander) {
            return (
                <CheckboxExpander 
                    rowId={row.id}
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

export default CheckboxBodyCell;
