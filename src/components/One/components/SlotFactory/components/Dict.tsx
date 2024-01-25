import * as React from "react";
import { useCallback } from "react";

import SearchView from "../../../../SearchView";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import useActualValue from "../../../../../hooks/useActualValue";

import deepClone from "../../../../../utils/deepClone";

import { IDictSlot } from "../../../slots/DictSlot";

const DEFAULT_LIMIT = 25;
const DEFAULT_DELAY = 500;
const DEFAULT_ONTEXT = () => null;
const DEFAULT_VALUE = () => {
  throw new Error(
    "react-declarative DictField dictValue callback is not provided"
  );
};
const DEFAULT_SEARCH = () => {
  throw new Error(
    "react-declarative DictField dictSearch callback is not provided"
  );
};

export const Dict = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputMode = "text",
  inputPattern = undefined,
  inputAutocomplete,
  description = "",
  outlined = true,
  title = "",
  placeholder = "",
  dirty,
  loading,
  inputRef,
  onChange,
  name,
  dictLimit = DEFAULT_LIMIT,
  dictDelay = DEFAULT_DELAY,
  dictOnText = DEFAULT_ONTEXT,
  dictSearch = DEFAULT_SEARCH,
  dictValue = DEFAULT_VALUE,
  dictAppend,
  dictSearchItem,
  dictCreateButton,
}: IDictSlot) => {
  const payload = useOnePayload();
  const { object, setObject } = useOneState<object>();

  const object$ = useActualValue(object);

  const handleChange = useCallback(
    (object: object) =>
      setObject(
        deepClone({
          ...object$.current,
          ...object,
        }),
        {}
      ),
    []
  );

  return (
    <SearchView
      name={name}
      sx={{
        ...(!outlined && {
          position: "relative",
          mt: 1,
          "& .MuiFormHelperDict-root": {
            position: "absolute",
            top: "100%",
          },
        }),
      }}
      handler={async (search, limit, offset, initial, rows) => {
        return await dictSearch({
          search,
          limit,
          offset,
          initial,
          data: object$.current,
          payload,
          rows,
        });
      }}
      mode={inputMode}
      pattern={inputPattern}
      autoComplete={inputAutocomplete}
      limit={dictLimit}
      delay={dictDelay}
      inputRef={inputRef}
      variant={outlined ? "outlined" : "standard"}
      helperText={(dirty && (invalid || incorrect)) || description}
      error={dirty && (invalid !== null || incorrect !== null)}
      type={inputType as any}
      value={async () => {
        if (value) {
          return await dictValue(value, object$.current, payload);
        }
        return null;
      }}
      placeholder={placeholder}
      onChange={(item) => onChange(item?.value || null)}
      onTextChange={(search) =>
        dictOnText(search, object$.current, payload, handleChange)
      }
      onCreate={
        dictAppend
          ? (search) => dictAppend(search, object$.current, payload, handleChange)
          : undefined
      }
      label={title}
      disabled={disabled || loading || readonly}
      SearchItem={dictSearchItem}
      CreateButton={dictCreateButton}
    />
  );
};

export default Dict;
