import * as React from "react";
import { useState, forwardRef } from "react";

import { makeStyles } from "../../../../../styles";

import MatCheckBox, { CheckboxProps } from "@mui/material/Checkbox";

import SelectionMode from "../../../../../model/SelectionMode";

import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";

import RowMark from "../../RowMark";
import RowAvatar from "../../RowAvatar";

import { useGridSlotComponentProps } from "../hooks/useGridSlotComponentProps";
import useRowId from "../hooks/useRowId";

import { useProps } from "../../PropProvider";

type ICheckBoxProps = CheckboxProps;

const UNSET_ROW_ID = Symbol('unset-row-id');

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
    const gridProps = useGridSlotComponentProps();
    const classes = useStyles();

    const { onSelectedRows, selectionMode, rowMark, rowAvatar, rows } = useProps();
    const [ rowId, setRowId ] = useState<any>(UNSET_ROW_ID);

    const watchRowId = useRowId((rowId) => setRowId(rowId));

    const handleRef = (instance: HTMLButtonElement | null) => {
        instance && watchRowId(instance);
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
                    className={className}
                    onKeyDown={handleCheckBoxChange}
                    onChange={handleCheckBoxChange}
                    onClick={handleCheckBoxChange}
                    checked={checked}
                    color={color}
                    disabled={disabled || rowId === UNSET_ROW_ID}
                    tabIndex={tabIndex}
                    ref={ref}
                />
            );
        } else if (selectionMode === SelectionMode.Single) {
            return (
                <Radio
                    className={className}
                    onKeyDown={handleRadioChange}
                    onChange={handleRadioChange}
                    onClick={handleRadioChange}
                    disabled={disabled || rowId === UNSET_ROW_ID}
                    checked={checked}
                    color={color}
                    tabIndex={tabIndex}
                    ref={ref}
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
                />
            );
        }
    };

    return (
        <Box ref={handleRef} className={classes.root}>
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
