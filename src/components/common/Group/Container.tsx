import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import { Grid } from '@mui/material';

import { PickProp } from '../../../model/IManaged';
import IField from '../../../model/IField';

/**
 * Interface representing the props for the Container component.
 */
interface IContainerProps {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  columnsOverride?: PickProp<IField, 'columnsOverride'>;
  sx?: PickProp<IField, 'sx'>;
  isBaselineAlign?: boolean;
  children: React.ReactNode;
  onFocus?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Converts a string to a number.
 *
 * @param v - The string value to be converted to a number.
 * @returns - The converted number value.
 */
const n = (v: string) => Number(v) as any;

/**
 * Represents a container component that wraps its child components within a grid layout.
 *
 * @param props - The properties of the Container component.
 * @param props.className - The class name of the Container component.
 * @param props.style - The inline styles to be applied to the Container component.
 * @param props.children - The child components to be rendered within the Container component.
 * @param props.onFocus - The callback function to be called when the Container component receives focus.
 * @param props.onClick - The callback function to be called when the Container component is clicked.
 * @param props.isBaselineAlign - Determines whether the child components within the Container component should be aligned at the baseline.
 * @param props.columnsOverride - Overrides the number of columns to be used for the grid layout within the Container component.
 * @param props.sx - The custom theme styling object to be applied to the Container component.
 * @param props.onContextMenu - The callback function to be called when the Container component's context menu is triggered.
 * @param ref - The ref to attach to the Container component's underlying div element.
 * @returns The rendered Container component.
 */
export const Container = ({
  className,
  style,
  children,
  onFocus,
  onClick,
  isBaselineAlign,
  columnsOverride,
  sx,
  onContextMenu,
  ...otherProps
}: IContainerProps, ref: React.Ref<HTMLDivElement>) => {
  const columns = useMemo(() => columnsOverride && n(columnsOverride), []);
  return (
    <Grid
      {...otherProps}
      ref={ref}
      container={true}
      alignItems={isBaselineAlign ? "flex-end" : "flex-start"}
      className={className}
      style={style}
      onClick={onClick}
      onFocus={onFocus}
      columns={columns}
      onContextMenu={onContextMenu}
      sx={sx}
    >
      {children}
    </Grid>
  );
}

Container.displayName = 'Container';

export default forwardRef(Container);
