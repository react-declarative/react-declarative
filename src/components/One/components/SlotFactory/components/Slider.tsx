import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MatSlider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import IAnything from "../../../../../model/IAnything";
import IManaged, { PickProp } from "../../../../../model/IManaged";

import { ISliderSlot } from "../../../slots/SliderSlot";

const createIcon = (
  icon: React.ComponentType<any>,
  data: IAnything,
  payload: IAnything,
  disabled: boolean,
  readonly: boolean,
  value: IAnything,
  onChange: (data: IAnything) => void,
  onValueChange: PickProp<IManaged, "onChange">,
  click: PickProp<IManaged, "leadingIconClick">,
  edge: "start" | "end",
  ripple: boolean,
) => (
  <IconButton
    disableRipple={!ripple}
    onClick={() => {
      if (click) {
        click(
          value,
          data,
          payload,
          (v) =>
            onValueChange(v, {
              skipReadonly: true,
            }),
          onChange
        );
      }
    }}
    edge={edge}
  >
    {React.createElement(icon, { data, payload, disabled, readonly })}
  </IconButton>
);

export const Slider = ({
  value,
  onChange,
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  leadingIconRipple: lir = true,
  trailingIconRipple: tir = true,
  labelFormatSlider,
  stepSlider,
  disabled,
  readonly,
  maxSlider = 100,
  minSlider = 0,
}: ISliderSlot) => {
  const payload = useOnePayload();
  const { object, changeObject: handleChange } = useOneState<object>();
  return (
    <Box mr={1}>
      <Grid alignItems="center" container spacing={2}>
        <Grid item>
          {li &&
            createIcon(
              li,
              object,
              payload,
              !!disabled,
              !!readonly,
              value as IAnything,
              handleChange,
              onChange,
              lic,
              "end",
              lir,
            )}
        </Grid>
        <Grid item xs>
          <MatSlider
            disabled={disabled}
            step={stepSlider}
            marks={!!stepSlider}
            min={minSlider}
            max={maxSlider}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            color="primary"
            value={value || 0}
            onChange={({}, v) => !readonly && onChange(v as number)}
            valueLabelFormat={labelFormatSlider}
          />
        </Grid>
        <Grid item>
          {ti &&
            createIcon(
              ti,
              object,
              payload,
              !!disabled,
              !!readonly,
              value as IAnything,
              handleChange,
              onChange,
              tic,
              "start",
              tir,
            )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Slider;
