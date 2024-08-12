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

/**
 * Creates an icon component.
 * @param icon - The icon component to be rendered.
 * @param data - The data object.
 * @param payload - The payload object.
 * @param disabled - Indicates if the icon is disabled.
 * @param readonly - Indicates if the icon is read-only.
 * @param value - The value object.
 * @param onChange - The callback function triggered when the value changes.
 * @param onValueChange - The callback function triggered when the value changes.
 * @param click - The callback function triggered when the icon is clicked.
 * @param edge - The edge where the icon is positioned.
 * @param ripple - Indicates if the icon should have a ripple effect.
 * @returns - The icon component.
 */
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
  tabIndex: PickProp<IManaged, "leadingIconTabIndex">,
  edge: "start" | "end",
  ripple: boolean,
) => (
  <IconButton
    disableRipple={!ripple}
    tabIndex={tabIndex}
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

/**
 * Represents a slider component.
 *
 * @param value - The current value of the slider.
 * @param onChange - The callback function to be called when the value of the slider changes.
 * @param leadingIcon - The leading icon component of the slider.
 * @param trailingIcon - The trailing icon component of the slider.
 * @param leadingIconClick - The callback function to be called when the leading icon is clicked.
 * @param trailingIconClick - The callback function to be called when the trailing icon is clicked.
 * @param leadingIconRipple - Whether the leading icon supports ripple effect. Default is true.
 * @param trailingIconRipple - Whether the trailing icon supports ripple effect. Default is true.
 * @param labelFormatSlider - The format of the value label displayed on the slider.
 * @param stepSlider - The step value between each selectable value on the slider.
 * @param disabled - Whether the slider is disabled.
 * @param readonly - Whether the slider is readonly.
 * @param maxSlider - The maximum value of the slider. Default is 100.
 * @param minSlider - The minimum value of the slider. Default is 0.
 */
export const Slider = ({
  value,
  onChange,
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  leadingIconTabIndex,
  trailingIconTabIndex,
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
              leadingIconTabIndex,
              "start",
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
              trailingIconTabIndex,
              "end",
              tir,
            )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Slider;
