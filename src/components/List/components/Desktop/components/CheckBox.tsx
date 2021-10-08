import * as React from "react";
import { makeStyles } from "@material-ui/core";
import { useRef, useState, forwardRef } from "react";

import MatCheckBox, { CheckboxProps } from "@material-ui/core/Checkbox";

import SelectionMode from "../../../../../model/SelectionMode";

import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";

import RowMark from "./RowMark";
import RowAvatar from "./RowAvatar";

import { useGridSlotComponentProps } from "@material-ui/data-grid";
import { useProps } from "../../PropProvider";

type ICheckBoxProps = CheckboxProps;

const UNSET_ROW_ID = Symbol('unset-row-id');
const GRID_ROW = ".MuiDataGrid-row[data-id]";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 4,
    },
});

export const CheckBox = forwardRef<HTMLButtonElement, ICheckBoxProps>(({
    checked,
    className,
    color,
    disabled,
    tabIndex,
}: ICheckBoxProps, ref) => {
    const elementRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
    const gridProps = useGridSlotComponentProps();
    const classes = useStyles();

    const { onSelectedRows, selectionMode, rowMark, rowAvatar, rows } = useProps();
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

    const renderBox = () => {
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
        } else if (rowAvatar && rowId !== UNSET_ROW_ID) {
            return (
                <RowAvatar
                    rows={rows}
                    rowAvatar={rowAvatar}
                    rowId={rowId}
                />
            );
        } else {
            return (
                <MatCheckBox
                    disabled
                    ref={handleRef}
                />
            );
        }
    };

    return (
        <Box className={classes.root}>
            {!!rowMark && rowId !== UNSET_ROW_ID && (
                <RowMark
                    rows={rows}
                    rowMark={rowMark}
                    rowId={rowId}
                />
            )}
            {renderBox()}
        </Box>
    );
});

export default CheckBox;
