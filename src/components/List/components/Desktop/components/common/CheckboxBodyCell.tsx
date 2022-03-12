import * as React from 'react';

import { makeStyles } from '../../../../../../styles';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableCell from '@mui/material/TableCell';

import { useProps } from "../../../PropProvider";

import IRowData from '../../../../../../model/IRowData';
import IAnything from '../../../../../../model/IAnything';

import SelectionMode from '../../../../../../model/SelectionMode';

import useSelection from '../../hooks/useSelection';
import useRowAvatar from '../../../hooks/useRowAvatar';
import useRowMark from '../../../hooks/useRowMark';

interface ICheckboxBodyCellProps<RowData extends IRowData = IAnything> {
    row: RowData;
}

const useStyles = makeStyles({
    mark: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
    },
});

export const CheckboxBodyCell = <RowData extends IRowData = IAnything>({
    row,
}: ICheckboxBodyCellProps<RowData>) => {

    const classes = useStyles();

    const avatar = useRowAvatar({ row });
    const mark = useRowMark({ row });

    const props = useProps<RowData>();
    const { selection, setSelection } = useSelection();

    const {
        selectionMode = SelectionMode.None,
        rowAvatar,
        rowMark,
    } = props;

    const createToggleHandler = (radio = false) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (selection.has(row.id)) {
            selection.delete(row.id);
        } else {
            radio && selection.clear();
            selection.add(row.id);
        }
        setSelection(selection);
    };

    const renderCheckbox = () => {
        if (rowAvatar && avatar) {
            const normalStyles = {
                height: 42,
                width: 42,
            }
            const markedStyles = {
                height: normalStyles.height - 4,
                width: normalStyles.width - 4,
                marginLeft: 2,
            };
            return (
                <Avatar
                    style={rowMark ? markedStyles : normalStyles}
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
        } else {
            return null;
        }
    };

    return (
        <TableCell padding="checkbox">
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
