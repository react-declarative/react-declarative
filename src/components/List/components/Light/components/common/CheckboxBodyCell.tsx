import * as React from 'react';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

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

import { ListAvatar } from '../../../../../../model/IListProps';

import useSelection from '../../hooks/useSelection';

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

    const [avatar, setAvatar] = useState<ListAvatar | null>(null);
    const [mark, setMark] = useState('');

    const isMountedRef = useRef(true);

    useLayoutEffect(() => () => {
        isMountedRef.current = false;
    }, []);

    const props = useProps<RowData>();
    const { selection, setSelection } = useSelection();

    const {
        selectionMode,
        rowAvatar,
        rowMark,
        fallback,
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

    useEffect(() => {
        const processAvatar = async () => {
            try {
                if (typeof rowAvatar === 'function') {
                    let result: ListAvatar | Promise<ListAvatar> | string = rowAvatar(row);
                    result = result instanceof Promise ? (await result) : result;
                    isMountedRef.current && setAvatar(typeof result === 'string' ? {
                        src: result,
                        alt: result,
                    } : result);
                } else if (typeof rowAvatar === 'string') {
                    isMountedRef.current && setAvatar({
                        src: row[rowAvatar] || '',
                        alt: row[rowAvatar] || '',
                    });
                } else if (rowAvatar) {
                    isMountedRef.current && setAvatar({
                        src: rowAvatar.src ? row[rowAvatar.src] : '',
                        alt: rowAvatar.alt ? row[rowAvatar.alt] : '',
                    });
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
            return;
        };
        processAvatar();
    }, [row, rowAvatar]);

    useEffect(() => {
        const processMark = async () => {
            try {
                if (typeof rowMark === 'function') {
                    let result: string | Promise<string> = rowMark(row);
                    result = result instanceof Promise ? (await result) : result;
                    isMountedRef.current && setMark(result);
                } else if (rowMark) {
                    isMountedRef.current && setMark(row[rowMark]);
                }
            } catch (e) {
                fallback && fallback(e as Error);
            }
            return;
        };
        processMark();
    }, [row, rowMark]);

    const renderCheckbox = () => {
        if (selectionMode === SelectionMode.Single) {
            return (
                <Radio
                    color="primary"
                    onClick={createToggleHandler(true)}
                    checked={selection.has(row.id)}
                    disabled
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
        } else if (rowAvatar && avatar) {
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
