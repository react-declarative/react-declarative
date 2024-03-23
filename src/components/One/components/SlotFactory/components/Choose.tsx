import * as React from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import ActionButton from "../../../../ActionButton";

import useSinglerunAction from "../../../../../hooks/useSinglerunAction";
import useReloadTrigger from "../../../../../hooks/useReloadTrigger";
import useAsyncValue from "../../../../../hooks/useAsyncValue";

import IAnything from "../../../../../model/IAnything";
import IField from "../../../../../model/IField";

import { IChooseSlot } from "../../../slots/ChooseSlot";

const EMPTY_ARRAY: any[] = [];

/**
 * Retrieves the processed input value based on the provided parameters.
 *
 * @param value - The input value to process.
 * @param tr - The transformation function.
 * @param data - Additional data used in the transformation process.
 * @param payload - Additional payload used in the transformation process.
 * @returns - The processed input value or null.
 */
const getInputValue = async (
  value: IAnything,
  tr: Exclude<IField["tr"], undefined>,
  data: IAnything,
  payload: IAnything
) => {
  if (Array.isArray(value)) {
    return await Promise.all(value.map((v) => tr(v, data, payload)));
  } else if (value) {
    return await tr(value, data, payload);
  } else {
    return null;
  }
};

/**
 * Represents a Choose variable.
 * @typedef IChooseSlot
 * @property invalid - The invalid value.
 * @property incorrect - The incorrect value.
 * @property value - The value.
 * @property disabled - The disabled value.
 * @property readonly - The readonly value.
 * @property description - The description value.
 * @property outlined - The outlined value.
 * @property title - The title value.
 * @property placeholder - The placeholder value.
 * @property labelShrink - The labelShrink value.
 * @property dirty - The dirty value.
 * @property upperLoading - The upperLoading value.
 * @property inputRef - The inputRef value.
 * @property onChange - The onChange value.
 * @property choose - The choose value.
 * @property tr - The tr value.
 */
export const Choose = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  outlined = false,
  title = "",
  placeholder = "Not chosen",
  labelShrink = true,
  dirty,
  loading: upperLoading,
  inputRef,
  onChange,
  choose = () => "unknown",
  tr = (value) => value,
}: IChooseSlot) => {
  const payload = useOnePayload();
  const { object } = useOneState();

  const { doReload, reloadTrigger } = useReloadTrigger();

  /**
   * Represents the value of an input.
   *
   * @typedef {string|number|boolean|null} inputValue
   */
    const [inputValue, { loading: currentLoading }] = useAsyncValue(
    async () => {
      return await getInputValue(value, tr, object, payload);
    },
    {
      deps: [value],
    }
  );

  /**
   * Handles the click event.
   *
   * @param {Event} event - The click event object.
   * @returns {void}
   */
    const { execute: handleClick, loading: chooseLoading } = useSinglerunAction(
    async () => {
      if (value) {
        onChange(null);
        return;
      }
      const pendingValue = await choose(object, payload);
      onChange(
        Array.isArray(pendingValue)
          ? pendingValue.length
            ? pendingValue
            : null
          : pendingValue || null
      );
    }
  );

  const loading = upperLoading || currentLoading || chooseLoading;

  return (
    <Autocomplete
      key={`${reloadTrigger}-${inputValue}`}
      fullWidth
      multiple={Array.isArray(inputValue)}
      disableClearable
      disabled={disabled}
      loading={loading}
      value={inputValue || null}
      options={EMPTY_ARRAY}
      onChange={() => null}
      freeSolo
      readOnly
      renderInput={(params) => (
        <TextField
          {...params}
          value={params.inputProps.value}
          variant={outlined ? "outlined" : "standard"}
          helperText={(dirty && (invalid || incorrect)) || description}
          error={dirty && (invalid !== null || incorrect !== null)}
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
          inputRef={inputRef}
          onClick={(e) => {
            e.currentTarget?.blur();
            if (!value) {
              handleClick();
            }
            doReload();
          }}
          InputProps={{
            ...params.InputProps,
            readOnly: true,
            placeholder,
            endAdornment: loading ? (
              params.InputProps.endAdornment
            ) : (
              <InputAdornment sx={{ position: "relative" }} position="end">
                <ActionButton
                  sx={{
                    position: "absolute",
                    right: 0,
                    pointerEvents: readonly ? "none" : "all",
                    mb: outlined ? undefined : 1,
                  }}
                  disabled={loading || disabled}
                  variant="outlined"
                  size="small"
                  color={value ? "secondary" : "primary"}
                  onClick={async () => {
                    await handleClick();
                  }}
                >
                  {value && "Deselect"}
                  {!value && "Choose"}
                </ActionButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: labelShrink || undefined,
          }}
          placeholder={placeholder}
          label={title}
        />
      )}
    />
  );
};

export default Choose;
