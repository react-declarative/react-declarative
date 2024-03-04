import * as React from "react";

import TreeView from "../../../../TreeView";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import useAsyncValue from "../../../../../hooks/useAsyncValue";

import { ITreeSlot } from "../../../slots/TreeSlot";

const EMPTY_ARRAY: any[] = [];

export const Tree = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  dirty,
  loading: upperLoading,
  onChange,
  itemTree = EMPTY_ARRAY,
}: ITreeSlot) => {
  const payload = useOnePayload();
  const { object } = useOneState();

  const [items, { loading: currentLoading }] = useAsyncValue(
    async () => {
      if (typeof itemTree === 'function') {
        return await itemTree(object, payload);
      } else {
        return itemTree;
      }
    },
    {
      deps: [value],
    }
  );

  const loading = upperLoading || currentLoading;

  return (
    <TreeView
      fullWidth
      sx={{
        flex: 1,
        ...(!outlined && {
          position: "relative",
          mt: 1,
          "& .MuiFormHelperText-root": {
            position: "absolute",
            top: "100%",
          },
        }),
      }}
      readOnly={readonly}
      items={items || EMPTY_ARRAY}
      value={items?.length ? value : null}
      disabled={disabled || loading}
      variant={outlined ? "outlined" : "standard"}
      helperText={(dirty && (invalid || incorrect)) || description}
      error={dirty && (invalid !== null || incorrect !== null)}
      placeholder={placeholder}
      label={title}
      onChange={onChange}
    />
  );
};

export default Tree;
