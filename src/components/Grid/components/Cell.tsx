import * as React from 'react';
import { useMemo } from 'react';
import { SxProps } from '@mui/system';

import Box, { BoxProps } from '@mui/material/Box';

import { IColumn } from '../model/IColumn';

import { useContainerSize } from '../hooks/useContainerSize';
import { useConstraintManager } from '../hooks/useConstraintManager';

import { DEFAULT_ROW_WIDTH } from '../config';

interface ICellProps extends BoxProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  idx: number;
  column: IColumn;
  children: React.ReactNode;
}

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
  const { width: containerWidth } = useContainerSize();

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
