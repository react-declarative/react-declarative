import * as React from "react";
import { useMemo, useState } from "react";

import Box, { BoxProps } from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { makeStyles } from "../../../styles";

import ActionTrigger from "../../ActionTrigger";

import useStateContext from "../context/StateContext";
import usePropsContext from "../context/PropsContext";

import classNames from "../../../utils/classNames";

import IItemData from "../model/IItemData";

interface IOperationsProps<ItemData extends IItemData = any> extends BoxProps {
  disabled: boolean;
  items: ItemData[];
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

export const Operations = <ItemData extends IItemData = any>({
  className,
  style,
  sx,
  items,
  disabled,
}: IOperationsProps<ItemData>) => {
  const [loading, setLoading] = useState(false);
  const { classes } = useStyles();
  const { state, action } = useStateContext();
  const {
    operations = [],
    fallback,
    onLoadStart = () => undefined,
    onLoadEnd = () => undefined,
    onOperation = () => undefined,
    throwError = false,
  } = usePropsContext();
  const selectedIds = useMemo(
    () => [...state.selectedIds],
    [state.selectedIds]
  );
  const itemsMap = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );
  const selectedItems = useMemo(
    () => selectedIds.map((id) => itemsMap.get(id)),
    [selectedIds, itemsMap]
  );
  return (
    <Box className={classNames(classes.root, className)} style={style} sx={sx}>
      <ActionTrigger
        className={classNames(classes.operations, {
          [classes.disabled]: disabled,
        })}
        actions={operations.map(
          ({ isAvailable = () => true, ...operation }) => ({
            isAvailable: () => isAvailable(selectedItems, state.isAllSelected),
            ...operation,
          })
        )}
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
        deps={[selectedIds, state.isAllSelected]}
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
