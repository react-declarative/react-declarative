import * as React from "react";
import { useMemo } from "react";

import { makeStyles } from "../../../styles";
import {
  Theme,
  alpha,
  decomposeColor,
  recomposeColor,
  useTheme,
} from "@mui/material";

import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FadeView from "../../FadeView";

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

export const ModernChipListSlot = ({
  listChips = [],
  loading,
}: IChipListSlot) => {
  const { classes } = useStyles();

  const { chips, setChips } = useChips();

  const createToggleHandler =
    (name: string, state = true) =>
    () => {
      chips.set(name, state);
      setChips(chips);
    };

  const theme = useTheme<Theme>();

  const fadeColor = useMemo(() => {
    const a = 0.05;
    const oneminusalpha = 1 - a;
    const background = decomposeColor(theme.palette.background.paper);
    const overlay = decomposeColor(
      alpha(theme.palette.getContrastText(theme.palette.background.paper), a)
    );
    background.values[0] =
      overlay.values[0] * a + oneminusalpha * background.values[0];
    background.values[1] =
      overlay.values[1] * a + oneminusalpha * background.values[1];
    background.values[2] =
      overlay.values[2] * a + oneminusalpha * background.values[2];
    background.values[3] = 1.0;
    return recomposeColor(background);
  }, [theme]);

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
    <FadeView className={classes.root} color={fadeColor} disableBottom>
      <Stack alignItems="center" direction="row" spacing={1} pl={1}>
        {listChips.map(renderChip)}
      </Stack>
    </FadeView>
  );
};

export default ModernChipListSlot;
