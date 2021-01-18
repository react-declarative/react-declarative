import * as React from 'react';

import { Box, Switch, Typography } from '@material-ui/core';

import makeField from '../components/makeField';
import IManaged, { PickProp } from '../model/IManaged';
import IField from '../model/IField';

export interface ISwitchFieldProps {
  title?: PickProp<IField, 'title'>;
}

interface ISwitchFieldPrivate {
  onChange: PickProp<IManaged, 'onChange'>;
  disabled: PickProp<IManaged, 'disabled'>;
  value: PickProp<IManaged, 'value'>;
}

export const SwitchField = ({
  disabled,
  value,
  onChange,
  title
}: ISwitchFieldProps & ISwitchFieldPrivate) => (
  <Box display="flex" alignItems="center">
    <Box flex={1}>
      <Typography variant="body1">
        {title}
      </Typography>
    </Box>
    <Switch disabled={disabled} checked={Boolean(value)} onChange={() => onChange(!value)} />
  </Box>
);

export default makeField(SwitchField, true);
