import * as React from 'react';

import IconButton from '@mui/material/IconButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { RowId } from '../../../../../../model/IRowData';

import useExpansion from '../../../../hooks/useExpansion';

interface ICheckboxExpanderProps {
    rowId: RowId;
}

export const CheckboxExpander = ({
    rowId,
}: ICheckboxExpanderProps) => {
    const { expansion, toggleExpansion } = useExpansion();

    const handleToggle = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        toggleExpansion(rowId);
    };

    return (
        <IconButton onClick={handleToggle}>
            {expansion.has(rowId) ? (
                <ExpandLess />
            ) : (
                <ExpandMore />
            )}
        </IconButton>
    );
};

export default CheckboxExpander;
