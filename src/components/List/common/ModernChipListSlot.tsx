import * as React from "react";

import { makeStyles } from "../../../styles";
import { alpha } from "@mui/material";

import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import useChips from "../hooks/useChips";

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

export const ModernChipListSlot = ({ listChips = [], loading }: IChipListSlot) => {
  const { classes } = useStyles();

  const { chips, setChips } = useChips();

  const createToggleHandler =
    (name: string, state = true) =>
    () => {
      chips.set(name, state);
      setChips(chips);
    };

  const renderChip = (chip: IListChip, idx: number) => {
    const name = chip.name.toString();
    const enabled = !!chips.get(name);
    return (
      <FormControlLabel
        key={idx}
        control={
          <Checkbox
            onClick={createToggleHandler(name, !enabled)}
            checked={enabled}
          />
        }
        label={chip.label}
        disabled={loading}
      />
    );
  };
  return (
    <Stack
      className={classes.root}
      alignItems="center"
      direction="row"
      spacing={1}
      pl={1}
    >
      {listChips.map(renderChip)}
    </Stack>
  );
};

export default ModernChipListSlot;
