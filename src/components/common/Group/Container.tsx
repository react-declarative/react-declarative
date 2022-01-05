import * as React from 'react';
import { forwardRef } from 'react';

import { Grid } from '@mui/material';

import { PickProp } from '../../../model/IManaged';
import IField from '../../../model/IField';

interface IContainerProps {
  className: PickProp<IField, 'className'>;
  style: PickProp<IField, 'style'>;
  children: React.ReactChild;
  onFocus?: () => void;
}

export const Container = ({
  className,
  style,
  children,
  onFocus,
}: IContainerProps, ref: React.Ref<HTMLDivElement>) => (
  <Grid
    ref={ref}
    container={true}
    alignItems="flex-start"
    className={className}
    style={style}
    onFocus={onFocus}
  >
    {children}
  </Grid>
);

Container.displayName = 'Container';

export default forwardRef(Container);
