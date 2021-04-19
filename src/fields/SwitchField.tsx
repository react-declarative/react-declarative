import * as React from 'react';

import { Box, Switch, Typography } from '@material-ui/core';

import makeField from '../components/makeField';

import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';
import IField from '../model/IField';

export interface ISwitchFieldProps<Data = IAnything>  {
  title?: PickProp<IField<Data>, 'title'>;
}

interface ISwitchFieldPrivate<Data = IAnything>  {
  onChange: PickProp<IManaged<Data>, 'onChange'>;
  disabled: PickProp<IManaged<Data>, 'disabled'>;
  value: PickProp<IManaged<Data>, 'value'>;
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

SwitchField.displayName = 'SwitchField';

export default makeField(SwitchField, true);
