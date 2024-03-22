import * as React from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import ScrollView from "../../ScrollView";

import useChips from "../hooks/useChips";
import useProps from "../hooks/useProps";

import { IListChip } from "../../../model/IListProps";

import { IChipListSlot } from "../slots/ChipListSlot";

const useStyles = makeStyles()((theme) => ({
  root: {
    height: 48,
    width: "100%",
    background: alpha(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05
    ),
  },
}));

/**
 * Renders a chip list slot component.
 *
 * @param listChips - The list of chips to render.
 * @param loading - Indicates whether the component is in a loading state.
 * @returns - The chip list slot component.
 */
export const ModernChipListSlot = ({
  listChips = [],
  loading,
}: IChipListSlot) => {
  const { classes } = useStyles();

  const { chips, setChips } = useChips();

  const { withSingleChip } = useProps();

  /**
   * Creates a toggle handler function that sets the state of a named chip.
   *
   * @param name - The name of the chip to toggle.
   * @param [state=true] - The initial state of the chip.
   * @returns - The toggle handler function.
   */
  const createToggleHandler =
    (name: string, state = true) =>
    () => {
      if (withSingleChip) {
        [...chips.keys()].forEach((key) => chips.set(key, false));
      }
      chips.set(name, state);
      setChips(chips);
    };

  /**
   * Renders a chip element with the given properties.
   *
   * @param chip - The chip object to render.
   * @param idx - The index of the chip in the list.
   * @returns The rendered chip element.
   */
  const renderChip = (chip: IListChip, idx: number) => {
    const name = chip.name.toString();
    const enabled = !!chips.get(name);
    return (
      <FormControlLabel
        key={idx}
        sx={{
          pointerEvents: "none",
          "& span:last-of-type": {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "125px",
          },
        }}
        control={
          <Checkbox
            onClick={createToggleHandler(name, !enabled)}
            sx={{ pointerEvents: "all" }}
            checked={enabled}
          />
        }
        label={chip.label}
        disabled={loading}
      />
    );
  };
  return (
    <ScrollView className={classes.root} hideOverflowY>
      <Stack
        width="100%"
        alignItems="center"
        direction="row"
        spacing={1}
        pl={1}
      >
        {listChips.map(renderChip)}
      </Stack>
    </ScrollView>
  );
};

export default ModernChipListSlot;
