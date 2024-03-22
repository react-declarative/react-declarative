import * as React from 'react';
import { useMemo, forwardRef } from 'react';
import { SxProps } from '@mui/material';

import Box from '@mui/material/Box';

import IColumn from '../model/IColumn';

import useContainerSize from '../hooks/useContainerSize';
import useConstraintManager from '../hooks/useConstraintManager';

import { VIRTUAL_VIEW_CHILD } from '../../VirtualView';

import classNames from '../../../utils/classNames';

import { DEFAULT_ROW_WIDTH, ACTIONS_WIDTH } from '../config';

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
 * @param {ILineProps} props - The properties for the line component.
 * @param {string} props.className - The additional CSS class name for the line component.
 * @param {object} props.style - The inline style object for the line component.
 * @param {object} props.sx - The inline style object for the line component using theme-ui.
 * @param {Array<IColumn>} props.columns - The columns to be rendered in the line component.
 * @param {ReactNode} props.children - The child components of the line component.
 * @param {boolean} props.withRowActions - Indicates whether or not the line component has row actions.
 * @param {React.Ref} ref - The ref for the line component.
 * @returns {ReactElement} The line component.
 */
export const Line = forwardRef(
  (
    { className, style, sx, columns, children, withRowActions }: ILineProps,
    ref,
  ) => {
    const constraintManager = useConstraintManager();
    const { width: fullWidth } = useContainerSize();

    const containerWidth = useMemo(
      () => Math.max(fullWidth - (withRowActions ? ACTIONS_WIDTH : 0), 0),
      [fullWidth, withRowActions],
    );

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
        .reduce((acm, cur) => acm + cur, 0);
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
