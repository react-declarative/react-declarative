import * as React from 'react';
import { forwardRef } from 'react';

import { Grid } from '@material-ui/core';

import { PickProp } from '../../model/IManaged';
import IField from '../../model/IField';

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

export default forwardRef(Container);
