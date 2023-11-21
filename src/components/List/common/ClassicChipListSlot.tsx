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

export const ClassicChipListSlot = ({
  listChips = [],
  loading,
}: IChipListSlot) => {
  const { classes } = useStyles();

  const { withSingleChip } = useProps();

  const { chips, setChips } = useChips();

  const createToggleHandler =
    (name: string, state = true) =>
    () => {
      if (withSingleChip) {
        [...chips.keys()].forEach((key) => chips.set(key, false));
      }
      chips.set(name, state);
      setChips(chips);
    };

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

  const enabledChips = listChips
    .filter(({ name }) => chips.get(name.toString()))
    .map(renderChip);

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
