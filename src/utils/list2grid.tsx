import * as React from 'react';

import Checkbox from "@mui/material/Checkbox";

import { IGridColumn } from "../components/Grid";
import Async from '../components/Async';

import IColumn from "../model/IColumn";
import ColumnType from "../model/ColumnType";

import get from './get';

const DEFAULT_MIN_WIDTH = 185;

interface IConfig {
  minWidth: number;
}

/**
 * Converts a list of columns and a payload into a grid configuration.
 *
 * @param columns - The list of columns.
 * @param payload - The payload data used for formatting.
 * @returns - The grid configuration.
 */
export const list2grid = (
  columns: IColumn[],
  {
    minWidth = DEFAULT_MIN_WIDTH,
  }: Partial<IConfig> = {},
): IGridColumn[] => {
  return columns
    .map((column, idx): IGridColumn | null => {
      const mockName = `${column.field || "unknown"}-${idx}`;
      if (column.type === ColumnType.Action) {
        return null;
      }
      if (column.type === ColumnType.CheckBox) {
        return {
          label: column.headerName || mockName,
          width: column.width,
          field: column.field,
          minWidth,
          format(row) {
            return (
              <Checkbox color="primary" disabled checked={row[column.field!]} />
            );
          },
        };
      }
      return {
        label: column.headerName || mockName,
        width: column.width,
        field: column.field,
        minWidth,
        format(row, payload) {
          if (column.compute || column.element) {
            return (
              <Async payload={row}>
                {async (row) => {
                  const { element: Element, compute } = column;
                  if (compute) {
                    return await compute(row, payload);
                  }
                  if (Element) {
                    return <Element {...row} _payload={payload} />;
                  }
                  return column.field ? get(row, column.field) : "";
                }}
              </Async>
            );
          }
          return column.field ? get(row, column.field) : "";
        },
      };
    })
    .filter((column) => column !== null) as IGridColumn[];
};

export default list2grid;
