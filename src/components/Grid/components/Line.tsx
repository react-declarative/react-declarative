import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import { SxProps } from '@mui/system';

import Box from '@mui/material/Box';

import IColumn from '../model/IColumn';

import useGridProps from '../hooks/useGridProps';
import useContainerSize from '../hooks/useContainerSize';
import useConstraintManager from '../hooks/useConstraintManager';

import { VIRTUAL_VIEW_CHILD } from '../../VirtualView';

import classNames from '../../../utils/classNames';

import { DEFAULT_ROW_WIDTH, ACTIONS_WIDTH } from '../config';

interface ILineProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  columns: Array<IColumn>;
  children: React.ReactNode;
  withRowActions: boolean;
}

export const Line = forwardRef(
  (
    { className, style, sx, columns, children, withRowActions }: ILineProps,
    ref,
  ) => {
    const constraintManager = useConstraintManager();
    const { width: fullWidth } = useContainerSize();
    const { rowActions } = useGridProps();
    const containerWidth = useMemo(() => Math.max(fullWidth - (rowActions ? ACTIONS_WIDTH : 0), 0), [fullWidth, rowActions]);

    const computedWidth = useMemo(() => {
      const compute = (column: IColumn) => () => {
        const field = column.width || DEFAULT_ROW_WIDTH;
        const result =
          typeof field === 'function' ? field(containerWidth) : field;
        return typeof result === 'string' ? parseFloat(result) : result;
      };
      let totalWidth = columns
        .map((column, idx) =>
          parseFloat(
            constraintManager.memoize(
              `column-width-${containerWidth}-${idx}`,
              compute(column),
            ) as string,
          ),
        )
        .reduce((acm, cur) => acm + cur);
      if (withRowActions) {
        totalWidth += ACTIONS_WIDTH;
      }
      return `${totalWidth}px !important`;
    }, [columns, containerWidth, withRowActions, constraintManager]);

    return (
      <Box
        ref={ref}
        className={classNames(className, VIRTUAL_VIEW_CHILD)}
        style={style}
        sx={{
          ...sx,
          minWidth: computedWidth,
          maxWidth: computedWidth,
        }}
      >
        {children}
      </Box>
    );
  },
);

export default Line;
