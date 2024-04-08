import * as React from 'react';
import { useMemo } from 'react';
import { SxProps } from '@mui/material';

import Box, { BoxProps } from '@mui/material/Box';

import { IColumn } from '../model/IColumn';

import { useGridProps } from '../hooks/useGridProps';
import { useContainerSize } from '../hooks/useContainerSize';
import { useConstraintManager } from '../hooks/useConstraintManager';

import { DEFAULT_ROW_WIDTH, ACTIONS_WIDTH, CHECKBOX_WIDTH } from '../config';
import SelectionMode from '../../../model/SelectionMode';

/**
 * Represents the properties of a cell in a table.
 */
interface ICellProps extends BoxProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  idx: number;
  column: IColumn;
  children: React.ReactNode;
}

/**
 * Represents a cell component in a grid.
 * @typedef ICellProps
 * @property className - The CSS class name for the cell.
 * @property style - The inline CSS style for the cell.
 * @property sx - The sx prop for the Box component used in the cell.
 * @property column - The column configuration for the cell.
 * @property idx - The index of the cell in the grid.
 * @property children - The content of the cell.
 * @property otherProps - Any additional props for the cell.
 */
export const Cell = ({
  className,
  style,
  sx,
  column,
  idx,
  children,
  ...otherProps
}: ICellProps) => {
  const constraintManager = useConstraintManager();
  const { width: fullWidth } = useContainerSize();
  const { rowActions, selectionMode = SelectionMode.None } = useGridProps();
  const containerWidth = useMemo(() => Math.max(fullWidth - (rowActions ? ACTIONS_WIDTH : 0) - (selectionMode === SelectionMode.None ? 0 : CHECKBOX_WIDTH), 0), [fullWidth, rowActions]);

  /**
   * Computed width of a column.
   *
   * It uses memoization to store and retrieve a previously computed value, based on the provided dependencies.
   *
   * @returns - The computed width as a string, in pixels or a custom format.
   *
   * @param column - The column object.
   * @param column.width - The width of the column. It can be a number (in pixels), a string (custom format), or a function returning a number or string.
   * @param containerWidth - The width of the container.
   * @param idx - The index of the column.
   * @param constraintManager - The constraint manager object.
   *
   * @dependencies The computed width will be recalculated whenever any of the following dependencies change:
   * - column.width
   * - containerWidth
   * - idx
   * - constraintManager
   */
  const computedWidth = useMemo(() => {
    const compute = () => {
      const field = column.width || DEFAULT_ROW_WIDTH;
      const result =
        typeof field === 'function' ? field(containerWidth) : field;
      return typeof result === 'number' ? `${result}px` : result;
    };
    return constraintManager.memoize(
      `column-width-${containerWidth}-${idx}`,
      compute,
    ) as string;
  }, [column.width, containerWidth, idx, constraintManager]);

  return (
    <Box
      className={className}
      style={style}
      sx={{
        ...sx,
        position: 'relative',
        minWidth: computedWidth,
        maxWidth: computedWidth,
      }}
      {...otherProps}
    >
      {children}
    </Box>
  );
};

export default Cell;
