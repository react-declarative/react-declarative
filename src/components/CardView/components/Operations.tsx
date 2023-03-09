import * as React from "react";
import { useState } from "react";

import Box, { BoxProps } from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { makeStyles } from "../../../styles";

import ActionTrigger from "../../ActionTrigger";

import useStateContext from "../context/StateContext";
import usePropsContext from "../context/PropsContext";
import usePayloadContext from "../context/PayloadContext";
import useSelectionContext from "../context/SelectionContext";

import classNames from "../../../utils/classNames";

interface IOperationsProps extends BoxProps {
  disabled: boolean;
}

const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
    maxWidth: "100%",
    overflowY: "auto",
    gap: 15,
  },
  operations: {
    flex: 1,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
});

export const Operations = ({
  className,
  style,
  sx,
  disabled,
}: IOperationsProps) => {
  const [loading, setLoading] = useState(false);
  const { classes } = useStyles();
  const { state, action } = useStateContext();
  const { selectedItems } = useSelectionContext();
  const payload = usePayloadContext();
  const {
    operations = [],
    fallback,
    onLoadStart = () => undefined,
    onLoadEnd = () => undefined,
    onOperation = () => undefined,
    throwError = false,
  } = usePropsContext();
  return (
    <Box className={classNames(classes.root, className)} style={style} sx={sx}>
      <ActionTrigger
        className={classNames(classes.operations, {
          [classes.disabled]: disabled,
        })}
        actions={operations.map(
          ({ isAvailable = () => true, ...operation }) => ({
            isAvailable: () => isAvailable(selectedItems, state.isAllSelected, payload),
            ...operation,
          })
        )}
        deps={[payload, selectedItems, state.isAllSelected]}
        onAction={(action) =>
          onOperation(action, selectedItems, state.isAllSelected)
        }
        onLoadStart={() => {
          setLoading(true);
          onLoadStart();
        }}
        onLoadEnd={(isOk) => {
          setLoading(false);
          onLoadEnd(isOk);
        }}
        fallback={fallback}
        throwError={throwError}
      />
      <FormControlLabel
        disabled={loading || disabled}
        control={
          <Checkbox
            disabled={loading}
            value={state.isAllSelected}
            onChange={() => action.setIsAllSelected(!state.isAllSelected)}
          />
        }
        label="All items"
      />
    </Box>
  );
};

export default Operations;
