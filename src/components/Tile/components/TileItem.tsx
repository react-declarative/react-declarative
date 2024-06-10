import * as React from "react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

import ListItemButton from "@mui/material/ListItemButton";
import { SxProps } from "@mui/material";

import useAsyncAction from "../../../hooks/useAsyncAction";

import useSelection from "../hooks/useSelection";
import useRowMark from "../hooks/useRowMark";

import SelectionMode from "../../../model/SelectionMode";
import IAnything from "../../../model/IAnything";
import ITileProps from "../model/ITileProps";

/**
 * Represents the props for the TileItem component.
 */
interface ITileItemProps {
  className?: string;
  index: number;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  data: IAnything;
  payload: IAnything;
  rowKey: Exclude<ITileProps["rowKey"], undefined>;
  children: ITileProps["children"];
  onItemClick: ITileProps["onItemClick"];
  selectionMode: ITileProps["selectionMode"];
}

/**
 * A tile item component that can be used in a list or grid layout.
 *
 * @component
 */
export const TileItem = forwardRef(
  (
    {
      className,
      style,
      index,
      data,
      sx,
      payload,
      rowKey,
      selectionMode,
      children,
      onItemClick,
    }: ITileItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [rowMarkColor, setRowMarkColor] = useState("");
    const [rowBgColor, setRowBgColor] = useState("");

    const { selection, setSelection } = useSelection();
    const { rowMark, rowColor } = useRowMark();

    const { execute } = useAsyncAction(async () => {
      setRowMarkColor(await rowMark(data));
      setRowBgColor(await rowColor(data));
    });

    useEffect(() => {
      execute();
    }, []);

    /**
     * Toggle the selection of a specific row.
     *
     * @param callback - The callback function to be executed when the selection is toggled.
     * @param data - The data object containing the rowKey.
     * @param rowKey - The key identifier of the row to be toggled.
     * @param selectionMode - The selection mode determining how many rows can be selected at once.
     * @param selection - The current selection set.
     * @param setSelection - The function to update the selection.
     */
    const toggleSelection = useCallback(() => {
      const id = data[rowKey];
      if (!id) {
        return;
      }
      if (selectionMode === SelectionMode.None) {
        return;
      }
      if (selectionMode === SelectionMode.Single) {
        if (selection.has(id) && selection.size === 1) {
          selection.delete(id);
        } else {
          selection.clear();
          selection.add(id);
        }
      } else {
        selection.has(id) ? selection.delete(id) : selection.add(id);
      }
      setSelection(new Set(selection));
    }, [selection]);

    /**
     * Determines whether a specific data item is currently selected.
     *
     * @param selection - The set containing selected row keys.
     * @param rowKey - The key for the data item to check.
     * @returns - True if the data item is selected, false otherwise.
     */
    const isSelected = useMemo(() => {
      return selection.has(data[rowKey]);
    }, [selection]);

    return (
      <ListItemButton
        ref={ref}
        disableRipple
        className={className}
        style={style}
        sx={{
          background: rowBgColor,
          '&:hover': {
            background: rowBgColor || 'transparent'
          },
          ...sx
        }}
        selected={isSelected}
        onClick={() => onItemClick && onItemClick({
          data,
          payload,
          toggleSelection,
          isSelected,
        })}
      >
        {React.createElement(children, {
          toggleSelection,
          data,
          payload,
          index,
          rowMark: rowMarkColor,
          isSelected,
        })}
      </ListItemButton>
    );
  }
) as unknown as React.FC<ITileItemProps>;

export default TileItem;
