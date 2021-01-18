import * as React from 'react';

import { Box, Grid, IconButton, Slider as MatSlider } from '@material-ui/core';

import makeField from '../components/makeField';
import icon from '../utils/createIcon';
import IField from '../model/IField';
import IManaged, { PickProp } from '../model/IManaged';
import IAnything from '../model/IAnything';

const createIcon = (
  icn: string | React.ComponentType,
  value: IAnything,
  onChange: PickProp<IManaged, 'onChange'>,
  click: PickProp<IManaged, 'leadingIconClick'>,
  edge: 'start' | 'end',
) => (
  <IconButton onClick={() => {
    if (click) {
      click(value, (v) => onChange(v, true))
    }
  }} edge={edge}>
    { icon(icn) }
  </IconButton>
);

const Slider = ({
  stepSlider,
  maxSlider = 100,
  minSlider = 0,
  onChange,
  value,
}: any) => (
  <MatSlider step={stepSlider} marks={!!stepSlider} min={minSlider} max={maxSlider}
    aria-labelledby="discrete-slider" valueLabelDisplay="auto" color="primary"
    value={value} onChange={({}, v) => onChange(v)} />
);

export interface ISliderFieldProps {
  stepSlider?: PickProp<IField, 'stepSlider'>;
  maxSlider?: PickProp<IField, 'maxSlider'>;
  minSlider?: PickProp<IField, 'minSlider'>;
  leadingIcon?: PickProp<IField, 'leadingIcon'>;
  trailingIcon?: PickProp<IField, 'trailingIcon'>;
  leadingIconClick?: PickProp<IField, 'leadingIconClick'>;
  trailingIconClick?: PickProp<IField, 'trailingIconClick'>;
  sliderThumbColor?: PickProp<IField, 'sliderThumbColor'>;
  sliderTrackColor?: PickProp<IField, 'sliderTrackColor'>;
  sliderRailColor?: PickProp<IField, 'sliderRailColor'>;
}

interface ISliderFieldPrivate {
  value: PickProp<IManaged, 'value'>;
  onChange: PickProp<IManaged, 'onChange'>;
}

export const SliderField = ({
  value,
  onChange,
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  ...otherProps
}: ISliderFieldProps & ISliderFieldPrivate) => (
  <Box mr={1}>
    <Grid alignItems="center" container spacing={2}>
      <Grid item>
        { li && createIcon(li, value as IAnything, onChange, lic, 'end') }
      </Grid>
      <Grid item xs>
        <Slider {...otherProps} onChange={onChange} value={value || 0}/>
      </Grid>
      <Grid item>
        { ti && createIcon(ti, value as IAnything, onChange, tic, 'start') }
      </Grid>
    </Grid>
  </Box>
);

SliderField.displayName = 'SliderField';

export default makeField(SliderField, false);
