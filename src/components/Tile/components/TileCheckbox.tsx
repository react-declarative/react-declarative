import * as React from 'react';

import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';

import SelectionMode from '../../../model/SelectionMode';

interface ITileCheckboxProps {
    isSelected: boolean;
    selectionMode: SelectionMode;
    toggleSelection: () => void;
    disabled?: boolean;
}

export const TileCheckbox = ({
    isSelected,
    selectionMode = SelectionMode.None,
    toggleSelection,
    disabled,
}: ITileCheckboxProps) => {
    if (selectionMode === SelectionMode.Single) {
        return (
            <Radio
                color="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection();
                }}
                checked={isSelected}
                disabled={disabled}
            />
        );
    } else if (selectionMode === SelectionMode.Multiple) {
        return (
            <Checkbox
                color="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection();
                }}
                checked={isSelected}
                disabled={disabled}
            />
        );
    } else {
        return <Checkbox color="primary" disabled />;
    }
};

export default TileCheckbox;
