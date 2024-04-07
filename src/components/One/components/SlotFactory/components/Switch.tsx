import * as React from "react";
import { useMemo } from "react";

import { makeStyles } from "../../../../../styles";
import { alpha } from "@mui/material";

import Box from "@mui/material/Box";
import MatSwitch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { ISwitchSlot } from "../../../slots/SwitchSlot";

/**
 * A function that returns the styles for a component using the material-ui makeStyles hook.
 *
 * @param theme - The material-ui theme object.
 * @returns - The styles object.
 */
const useStyles = makeStyles()((theme) => ({
  switchBase: {
    color: `${theme.palette.primary.main} !important`,
  },
  checked: {
    color: `${theme.palette.primary.main} !important`,
  },
  track: {
    background: `${alpha(theme.palette.primary.main, 0.4)} !important`,
  },
}));

/**
 * Represents a Switch component.
 * @param props - The properties of the Switch component.
 * @param props.disabled - Whether the Switch component is disabled.
 * @param props.value - The value of the Switch component.
 * @param props.onChange - The callback function when the value of the Switch component changes.
 * @param props.title - The title of the Switch component.
 * @param props.switchNoColor - Whether the Switch component has no color.
 * @param props.switchActiveLabel - The label for the active state of the Switch component.
 * @returns - The rendered Switch component.
 */
export const Switch = ({
  disabled,
  value,
  onChange,
  title,
  switchNoColor,
  switchActiveLabel,
}: ISwitchSlot) => {
  const { classes } = useStyles();

  const override = useMemo(() => (switchNoColor ? classes : undefined), []);

  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          flex: switchActiveLabel ? undefined : 1,
          whiteSpace: "nowrap",
          textAlign: switchActiveLabel ? "right" : undefined,
        }}
      >
        <Typography variant="body1">{title}</Typography>
      </Box>
      <MatSwitch
        disabled={disabled}
        classes={override}
        checked={Boolean(value)}
        onChange={(_, checked) => onChange(checked)}
      />
      {!!switchActiveLabel && (
        <Box sx={{ flex: 1, whiteSpace: "nowrap", textAlign: "left" }}>
          <Typography variant="body1">{switchActiveLabel}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Switch;
