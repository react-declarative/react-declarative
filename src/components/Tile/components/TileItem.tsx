import * as React from "react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

import ListItemButton from "@mui/material/ListItemButton";

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
  style?: React.CSSProperties;
  data: IAnything;
  payload: IAnything;
  rowKey: Exclude<ITileProps["rowKey"], undefined>;
  children: ITileProps["children"];
  onItemClick: ITileProps["onItemClick"];
  rowColor: string;
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
      data,
      payload,
      rowKey,
      rowColor,
      selectionMode,
      children,
      onItemClick,
    }: ITileItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [rowMarkColor, setRowMarkColor] = useState("");

    const { selection, setSelection } = useSelection();
    const rowMark = useRowMark();

    const { execute } = useAsyncAction(async () => {
      const color = await rowMark(data);
      setRowMarkColor(color);
    });

    useEffect(() => {
      execute();
      return () => {
        rowMark.clear(data[rowKey] || data);
      };
    }, []);

    /**
     * Toggle the selection of a specific row.
     *
     * @param {function} callback - The callback function to be executed when the selection is toggled.
     * @param {object} data - The data object containing the rowKey.
     * @param {string} rowKey - The key identifier of the row to be toggled.
     * @param {number} selectionMode - The selection mode determining how many rows can be selected at once.
     * @param {Set} selection - The current selection set.
     * @param {function} setSelection - The function to update the selection.
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

    const isSelected = useMemo(() => {
      return selection.has(data[rowKey]);
    }, [selection]);

    return (
      <ListItemButton
        ref={ref}
        className={className}
        style={style}
        sx={{
          background: rowColor,
        }}
        selected={isSelected}
        onClick={() => onItemClick && onItemClick({
          data,
          payload,
        })}
      >
        {React.createElement(children, {
          toggleSelection,
          data,
          payload,
          rowMark: rowMarkColor,
          isSelected,
        })}
      </ListItemButton>
    );
  }
) as unknown as React.FC<ITileItemProps>;

export default TileItem;
