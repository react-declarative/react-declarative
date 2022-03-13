import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';

import useProps from '../.../../../../../hooks/useProps';

import SelectionMode from '../../../../../../model/SelectionMode';
import IAnything from '../../../../../../model/IAnything';
import IRowData from '../../../../../../model/IRowData';

import useSelection from '../../../../hooks/useSelection';

interface IRowCheckboxProps<RowData extends IRowData = IAnything> {
    row: RowData,
}

const RowCheckbox = <RowData extends IRowData = IAnything>({
    row,
}: IRowCheckboxProps<RowData>) => {

    const {
        selectionMode,
    } = useProps();

    const { selection, setSelection } = useSelection();

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
