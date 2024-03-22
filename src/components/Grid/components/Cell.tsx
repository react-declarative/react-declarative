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
 * @typedef {Object} ICellProps
 * @property {string} className - The CSS class name for the cell.
 * @property {Object} style - The inline CSS style for the cell.
 * @property {Object} sx - The sx prop for the Box component used in the cell.
 * @property {Object} column - The column configuration for the cell.
 * @property {number} idx - The index of the cell in the grid.
 * @property {ReactNode} children - The content of the cell.
 * @property {Object} otherProps - Any additional props for the cell.
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
