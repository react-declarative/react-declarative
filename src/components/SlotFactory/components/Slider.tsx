import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MatSlider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';

import IAnything from '../../../model/IAnything';
import IManaged, { PickProp } from '../../../model/IManaged';

import icon from '../../../utils/createIcon';

import { ISliderSlot } from '../../../slots/SliderSlot';

const createIcon = (
    icn: string | React.ComponentType,
    value: IAnything,
    onChange: PickProp<IManaged, 'onChange'>,
    click: PickProp<IManaged, 'leadingIconClick'>,
    edge: 'start' | 'end',
) => (
    <IconButton onClick={() => {
        if (click) {
            click(value, (v) => onChange(v, {
                skipReadonly: true,
            }))
        }
    }} edge={edge}>
        {icon(icn)}
    </IconButton>
);

export const Slider = ({
    value,
    onChange,
    leadingIcon: li,
    trailingIcon: ti,
    leadingIconClick: lic,
    trailingIconClick: tic,
    stepSlider,
    maxSlider = 100,
    minSlider = 0,
  }: ISliderSlot) => (
    <Box mr={1}>
      <Grid alignItems="center" container spacing={2}>
        <Grid item>
          { li && createIcon(li, value as IAnything, onChange, lic, 'end') }
        </Grid>
        <Grid item xs>
          <MatSlider step={stepSlider} marks={!!stepSlider} min={minSlider} max={maxSlider}
            aria-labelledby="discrete-slider" valueLabelDisplay="auto" color="primary"
            value={value || 0} onChange={({ }, v) => onChange(v as number)} />
        </Grid>
        <Grid item>
          { ti && createIcon(ti, value as IAnything, onChange, tic, 'start') }
        </Grid>
      </Grid>
    </Box>
);
  

export default Slider;
