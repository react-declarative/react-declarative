import * as React from "react";
import { useRef, useState, forwardRef } from "react";

import MatCheckBox, { CheckboxProps } from "@material-ui/core/Checkbox";

import Radio from "@material-ui/core/Radio";

import { useGridSlotComponentProps } from "@material-ui/data-grid";
import { useProps } from "../../PropProvider";

import SelectionMode from "../../../../../model/SelectionMode";

type ICheckBoxProps = CheckboxProps;

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
    const [ rowIndex, setRowIndex ] = useState(-1);

    const handleRef = (instance: HTMLButtonElement | null) => {
        if (typeof ref === 'function') {
            ref(instance);
        } else if (ref) {
            ref.current = instance;
        }
        if (instance) {
            const target = instance.closest<HTMLElement>("*[data-id]");
            const currentRow = target?.dataset?.rowindex;
            currentRow && setRowIndex(Number(currentRow));
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
            grid.selectRow(rowIndex + 1, false);
        } else {
            grid.selectRow(rowIndex + 1, true);
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
            grid.selectRow(rowIndex + 1, false);
        } else {
            grid.selectRow(rowIndex + 1, true);
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
                disabled={disabled || rowIndex === -1}
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
                disabled={disabled || rowIndex === -1}
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
