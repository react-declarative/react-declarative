import * as React from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ScrollView from "../../ScrollView";

import useChips from "../hooks/useChips";
import useProps from "../hooks/useProps";

import { IListChip } from "../../../model/IListProps";

import { IChipListSlot } from "../slots/ChipListSlot";

/**
 * @typedef {Object} Styles
 * @property root - The CSS properties for the root element.
 * @property root.height - The height of the root element in pixels.
 * @property root.width - The width of the root element as a CSS value.
 * @property root.background - The background color of the root element.
 *
 * @typedef {Function} useStyles
 * @param theme - The theme object provided by the Material-UI library.
 * @returns The computed styles object.
 */
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
 * Renders a chip list in a slot layout.
 *
 * @param listChips - The array of chip objects to be rendered.
 * @param loading - Indicates whether the chip list is currently loading.
 * @returns - The rendered chip list slot component.
 */
export const ClassicChipListSlot = ({
  listChips = [],
  loading,
}: IChipListSlot) => {
  const { classes } = useStyles();

  const { withSingleChip } = useProps();

  const { chips, setChips } = useChips();

  /**
   * Creates a toggle handler function for managing state of a chip.
   *
   * @param name - The name of the chip.
   * @param [state=true] - The initial state of the chip. Default is true.
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
   * Renders a chip based on the given chip data.
   *
   * @param chip - The chip data.
   * @returns - The rendered chip component.
   */
  const renderChip = (chip: IListChip) => {
    const name = chip.name.toString();
    const enabled = !!chips.get(name);
    return (
      <Chip
        variant={enabled ? "filled" : "outlined"}
        onClick={createToggleHandler(name, !enabled)}
        onDelete={enabled ? createToggleHandler(name, false) : undefined}
        color="primary"
        label={chip.label}
        disabled={loading}
      />
    );
  };

  /**
   * Returns an array of enabled chips based on the provided list of chips.
   *
   * @param listChips - The list of chips to filter and map.
   * @returns The array of enabled chips.
   */
  const enabledChips = listChips
    .filter(({ name }) => chips.get(name.toString()))
    .map(renderChip);

  /**
   * Filters and maps the given list of chips based on the presence of their names in the chips object.
   *
   * @param listChips - The list of chips to filter and map.
   * @returns - The filtered and mapped chips.
   */
  const disabledChips = listChips
    .filter(({ name }) => !chips.get(name.toString()))
    .map(renderChip);

  return (
    <ScrollView className={classes.root} hideOverflowY>
      <Stack
        alignItems="center"
        direction="row"
        marginLeft="5px"
        marginRight="5px"
        spacing={1}
      >
        {enabledChips}
        {disabledChips}
      </Stack>
    </ScrollView>
  );
};

export default ClassicChipListSlot;
