import * as React from "react";

import TreeView from "../../../../TreeView";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import useAsyncValue from "../../../../../hooks/useAsyncValue";

import { ITreeSlot } from "../../../slots/TreeSlot";

const EMPTY_ARRAY: any[] = [];

/**
 * Creates a Tree component with customizable options.
 *
 * @param Tree - The Tree component.
 * @param Tree.invalid - Indicates if the Tree is invalid.
 * @param Tree.incorrect - Indicates if the Tree is incorrect.
 * @param Tree.value - The current value of the Tree.
 * @param Tree.disabled - Indicates if the Tree is disabled.
 * @param Tree.readonly - Indicates if the Tree is read only.
 * @param Tree.description - The description of the Tree.
 * @param Tree.outlined - Indicates if the Tree is outlined.
 * @param Tree.title - The title of the Tree.
 * @param Tree.placeholder - The placeholder text of the Tree.
 * @param Tree.dirty - Indicates if the Tree is dirty.
 * @param Tree.loading - The loading state of the Tree.
 * @param Tree.onChange - The event handler for onChange event.
 * @param Tree.itemTree - The item tree of the Tree.
 *
 * @returns The Tree component.
 */
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
      loading={loading}
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
