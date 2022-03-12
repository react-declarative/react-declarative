import * as React from 'react';
import { useCallback } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { useProps } from "../../PropProvider";

import IRowData from '../../../../../model/IRowData';
import IAnything from '../../../../../model/IAnything';
import SelectionMode from '../../../../../model/SelectionMode';
import ColumnType from '../../../../../model/ColumnType';

import useSortModel from '../hooks/useSortModel';

export const LightHeadRow = <RowData extends IRowData = IAnything>() => {

    const props = useProps<RowData>();
    const { sortModel, setSortModel } = useSortModel();

    const {
        columns = [],
        selectionMode,
    } = props;

    const renderCheckbox = () => {
        if (selectionMode === SelectionMode.Single) {
            return (
                <Radio
                    color="primary"
                    disabled
                />
            );
        } else {
            return (
                <Checkbox
                    color="primary"
                    disabled
                />
            );
        }
    };

    const handleSortToggle = useCallback((id: string) => {
        const sortTarget = sortModel.get(id);
        if (sortTarget) {
            if (sortTarget.sort === 'asc') {
                sortModel.set(id, {
                    field: id,
                    sort: 'desc',
                })
                
            } else if (sortTarget.sort === 'desc') {
                sortModel.delete(id);
            }
        } else {
            sortModel.set(id, {
                field: id,
                sort: 'asc',
            });
        }
        setSortModel(sortModel);
    }, [sortModel]);

    return (
        <TableRow>
            <TableCell padding="checkbox">
                {renderCheckbox()}
            </TableCell>
            {columns.map((column, idx) => {
                const sortTarget = sortModel.get(column.field || '');
                const sortDirection = sortTarget?.sort || undefined;

                let isSortable = !!column.field;
                isSortable = isSortable && column.sortable !== false;
                isSortable = isSortable && column.type !== ColumnType.Action;

                const handleClick = () => {
                    if (isSortable) {
                        handleSortToggle(column.field!);
                    }
                };

                const align = column.type === ColumnType.Action ? 'center' : 'left';

                return (
                    <TableCell
                        key={idx}
                        align={align}
                        sortDirection={sortDirection}
                    >
                        {isSortable ? (
                            <TableSortLabel
                                active={!!sortTarget}
                                direction={sortDirection}
                                onClick={handleClick}
                            >
                                {column.headerName}
                            </TableSortLabel>
                        ) : column.headerName}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export default LightHeadRow;
