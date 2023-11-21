import * as React from 'react';
import { forwardRef, useMemo } from 'react';

import { Grid } from '@mui/material';

import { PickProp } from '../../../model/IManaged';
import IField from '../../../model/IField';

interface IContainerProps {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  columnsOverride?: PickProp<IField, 'columnsOverride'>;
  sx?: PickProp<IField, 'sx'>;
  isBaselineAlign?: boolean;
  children: React.ReactNode;
  onFocus?: () => void;
}

const n = (v: string) => Number(v) as any;

export const Container = ({
  className,
  style,
  children,
  onFocus,
  isBaselineAlign,
  columnsOverride,
  sx,
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
      onFocus={onFocus}
      columns={columns}
      sx={sx}
    >
      {children}
    </Grid>
  );
}

Container.displayName = 'Container';

export default forwardRef(Container);
