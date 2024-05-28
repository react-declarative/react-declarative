import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import { SxProps } from '@mui/material';

import Box from '@mui/material/Box';

import IColumn from '../model/IColumn';

import useContainerSize from '../hooks/useContainerSize';
import useConstraintManager from '../hooks/useConstraintManager';

import { VIRTUAL_VIEW_CHILD } from '../../VirtualView';

import classNames from '../../../utils/classNames';

import { DEFAULT_COLUMN_WIDTH, ACTIONS_WIDTH, CHECKBOX_WIDTH } from '../config';

/**
 * Represents the properties for a Line component.
 */
interface ILineProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  columns: Array<IColumn>;
  children: React.ReactNode;
  withRowActions: boolean;
}

/**
 * A React component that represents a line.
 *
 * @component
 * @param props - The properties for the line component.
 * @param props.className - The additional CSS class name for the line component.
 * @param props.style - The inline style object for the line component.
 * @param props.sx - The inline style object for the line component using theme-ui.
 * @param props.columns - The columns to be rendered in the line component.
 * @param props.children - The child components of the line component.
 * @param props.withRowActions - Indicates whether or not the line component has row actions.
 * @param ref - The ref for the line component.
 * @returns The line component.
 */
export const Line = forwardRef(
  (
    { className, style, sx, columns, children, withRowActions }: ILineProps,
    ref,
  ) => {
    const constraintManager = useConstraintManager();
    const { width: fullWidth } = useContainerSize();

    /**
     * Calculates the width of a container based on the given conditions.
     *
     * @param fullWidth - The full width of the container.
     * @param withRowActions - Whether the container has row actions.
     *
     * @returns - The calculated width of the container.
     */
    const containerWidth = useMemo(
      () => Math.max(fullWidth - (withRowActions ? ACTIONS_WIDTH : 0), 0),
      [fullWidth, withRowActions],
    );

    /**
     * The computed width of a container.
     *
     * @type {string}
     */
    const computedWidth = useMemo(() => {
      const compute = (column: IColumn) => () => {
        const field = column.width || DEFAULT_COLUMN_WIDTH;
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
        .reduce((acm, cur) => acm + cur, 0);
      if (withRowActions) {
        totalWidth += ACTIONS_WIDTH;
      }
      totalWidth += CHECKBOX_WIDTH;
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
