import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';

import useProps from '../.../../../../../../hooks/useProps';

import SelectionMode from '../../../../../../../model/SelectionMode';
import IAnything from '../../../../../../../model/IAnything';
import IRowData from '../../../../../../../model/IRowData';

import useSelection from '../../../../../hooks/useSelection';
import useToggleHandler from '../../../../../hooks/useToggleHandler';

/**
 * Represents the properties for a row checkbox component.
 *
 * @template RowData - The type of the data for the row. It must implement the IRowData interface.
 */
interface IRowCheckboxProps<RowData extends IRowData = IAnything> {
    row: RowData,
}

/**
 * Represents a checkbox component for a row in a table.
 *
 * @template RowData - The type of data associated with a table row.
 *
 * @param props - The props for the component.
 *
 * @returns - The rendered checkbox component.
 */
const RowCheckbox = <RowData extends IRowData = IAnything>({
    row,
}: IRowCheckboxProps<RowData>) => {

    const {
        selectionMode,
    } = useProps();

    const { selection } = useSelection();

    const createToggleHandler = useToggleHandler(row);

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
    } else {
        return (
            <Checkbox
                color="primary"
                disabled
            />
        );
    } 
};

export default RowCheckbox;
