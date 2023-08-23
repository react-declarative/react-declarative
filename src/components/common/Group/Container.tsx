import * as React from 'react';
import { forwardRef } from 'react';

import { Grid } from '@mui/material';

import { PickProp } from '../../../model/IManaged';
import IField from '../../../model/IField';

interface IContainerProps {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  columnsOverride?: PickProp<IField, 'columnsOverride'>;
  sx?: PickProp<IField, 'sx'>;
  children: React.ReactNode;
  onFocus?: () => void;
}

const n = (v: string) => Number(v) as any;

export const Container = ({
  className,
  style,
  children,
  onFocus,
  columnsOverride,
  sx,
}: IContainerProps, ref: React.Ref<HTMLDivElement>) => (
  <Grid
    ref={ref}
    container={true}
    alignItems="flex-end"
    className={className}
    style={style}
    onFocus={onFocus}
    columns={columnsOverride && n(columnsOverride)}
    sx={sx}
  >
    {children}
  </Grid>
);

Container.displayName = 'Container';

export default forwardRef(Container);
