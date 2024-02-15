import * as React from "react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";

import ListItemButton from "@mui/material/ListItemButton";

import useAsyncAction from "../../../hooks/useAsyncAction";

import useSelection from "../hooks/useSelection";
import useRowMark from "../hooks/useRowMark";

import SelectionMode from "../../../model/SelectionMode";
import IAnything from "../../../model/IAnything";
import ITileProps from "../model/ITileProps";

interface ITileItemProps {
  className?: string;
  style?: React.CSSProperties;
  data: IAnything;
  payload: IAnything;
  rowKey: Exclude<ITileProps["rowKey"], undefined>;
  children: ITileProps["children"];
  rowColor: string;
  selectionMode: ITileProps["selectionMode"];
}

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
