import * as React from "react";
import { useRef, useState, forwardRef } from "react";

import MatCheckBox, { CheckboxProps } from "@material-ui/core/Checkbox";

import Radio from "@material-ui/core/Radio";

import { useGridSlotComponentProps } from "@material-ui/data-grid";
import { useProps } from "../../PropProvider";

import SelectionMode from "../../../../../model/SelectionMode";

type ICheckBoxProps = CheckboxProps;

const UNSET_ROW_ID = Symbol('unset-row-id');
const GRID_ROW = ".MuiDataGrid-row[data-id]";

export const CheckBox = forwardRef<HTMLButtonElement, ICheckBoxProps>(({
    checked,
    className,
    color,
    disabled,
    tabIndex,
}: ICheckBoxProps, ref) => {
    const elementRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
    const gridProps = useGridSlotComponentProps();

    const { onSelectedRows, selectionMode } = useProps();
    const [ rowId, setRowId ] = useState<any>(UNSET_ROW_ID);

    const handleRef = (instance: HTMLButtonElement | null) => {
        if (typeof ref === 'function') {
            ref(instance);
        } else if (ref) {
            ref.current = instance;
        }
        if (instance) {
            const target = instance.closest<HTMLElement>(GRID_ROW);
            const currentRowId = target?.dataset?.id;
            currentRowId && setRowId(currentRowId);
        }
        elementRef.current = instance;
    };

    const handleRadioChange = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const { current: grid } = gridProps.apiRef; 
        grid.getSelectedRows().forEach((_, id) => {
            grid.selectRow(id, false);
        });
        if (checked) {
            grid.selectRow(rowId, false);
        } else {
            grid.selectRow(rowId, true);
        }
        onSelectedRows && onSelectedRows([
            ...grid.getSelectedRows().values(),
        ]);
    };

    const handleCheckBoxChange = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const { current: grid } = gridProps.apiRef; 
        if (checked) {
            grid.selectRow(rowId, false);
        } else {
            grid.selectRow(rowId, true);
        }
        onSelectedRows && onSelectedRows([
            ...grid.getSelectedRows().values(),
        ]);
    };

    if (selectionMode === SelectionMode.Multiple) {
        return (
            <MatCheckBox
                ref={handleRef}
                className={className}
                onKeyDown={handleCheckBoxChange}
                onChange={handleCheckBoxChange}
                onClick={handleCheckBoxChange}
                checked={checked}
                color={color}
                disabled={disabled || rowId === UNSET_ROW_ID}
                tabIndex={tabIndex}
            />
        );
    } else if (selectionMode === SelectionMode.Single) {
        return (
            <Radio
                ref={handleRef}
                className={className}
                onKeyDown={handleRadioChange}
                onChange={handleRadioChange}
                onClick={handleRadioChange}
                disabled={disabled || rowId === UNSET_ROW_ID}
                checked={checked}
                color={color}
                tabIndex={tabIndex}
            />
        );
    } else {
        return null;
    }
});

export default CheckBox;
