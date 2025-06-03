import * as React from "react";
import { useMemo, useRef, useLayoutEffect } from "react";

import IconButton from "@mui/material/IconButton";
import MatTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import { ITextSlot } from "../../../slots/TextSlot";

import IManaged, { PickProp } from "../../../../../model/IManaged";
import { IField } from "../../../../../model/IField";
import IAnything from "../../../../../model/IAnything";

import formatText from "../../../../../utils/formatText";

const LOADING_LABEL = "Loading";
const NEVER_POS = Symbol("never-pos");

/**
 * Represents a set of icons.
 *
 * @param data - The data object.
 * @param payload - The payload object.
 * @param leadingIcon - The leading icon component.
 * @param trailingIcon - The trailing icon component.
 * @param leadingIconClick - The leading icon click handler.
 * @param trailingIconClick - The trailing icon click handler.
 * @param loading - Indicates if icons are in loading state.
 * @param disabled - Indicates if the icons are disabled.
 * @param readonly - Indicates if the icons are read-only.
 * @param v - The v value.
 * @param c - The onChange function.
 * @param cc - The cc function.
 * @param leadingIconRipple - Indicates if the leading icon has ripple effect.
 * @param trailingIconRipple - Indicates if the trailing icon has ripple effect.
 * @returns - The icons object with their respective properties.
 */
const icons = (
  data: IAnything,
  payload: IAnything,
  leadingIcon: React.ComponentType<any> | undefined,
  trailingIcon: React.ComponentType<any> | undefined,
  leadingIconClick: PickProp<IField, "leadingIconClick">,
  trailingIconClick: PickProp<IField, "trailingIconClick">,
  leadingIconTabIndex: PickProp<IField, "leadingIconTabIndex">,
  trailingIconTabIndex: PickProp<IField, "trailingIconTabIndex">,
  loading: boolean,
  disabled: boolean,
  readonly: boolean,
  v: string,
  c: PickProp<IManaged, "onChange">,
  cc: (data: IAnything) => void,
  leadingIconRipple: boolean,
  trailingIconRipple: boolean
) => ({
  ...(leadingIcon
    ? {
        startAdornment: (
          <InputAdornment sx={{ position: "relative" }} position="start">
            <IconButton
              edge="start"
              disabled={disabled}
              disableRipple={!leadingIconRipple}
              tabIndex={leadingIconTabIndex}
              onClick={() => {
                if (leadingIconClick) {
                  leadingIconClick(
                    v as unknown as IAnything,
                    data,
                    payload,
                    (v) =>
                      c(v, {
                        skipReadonly: true,
                      }),
                    cc
                  );
                }
              }}
            >
              {React.createElement(leadingIcon, {
                data,
                payload,
                disabled,
                readonly,
              })}
            </IconButton>
          </InputAdornment>
        ),
      }
    : {}),
  ...(trailingIcon && !loading
    ? {
        endAdornment: (
          <InputAdornment sx={{ position: "relative" }} position="end">
            <IconButton
              edge="end"
              disabled={disabled}
              disableRipple={!trailingIconRipple}
              tabIndex={trailingIconTabIndex}
              onClick={() => {
                if (trailingIconClick) {
                  trailingIconClick(
                    v as unknown as IAnything,
                    data,
                    payload,
                    (v) =>
                      c(v, {
                        skipReadonly: true,
                      }),
                    cc
                  );
                }
              }}
            >
              {React.createElement(trailingIcon, {
                data,
                payload,
                disabled,
                readonly,
              })}
            </IconButton>
          </InputAdornment>
        ),
      }
    : {}),
  ...(loading
    ? {
        endAdornment: (
          <InputAdornment sx={{ position: "relative" }} position="end">
            <IconButton disabled={disabled} edge="end">
              <CircularProgress color="inherit" size={20} />
            </IconButton>
          </InputAdornment>
        ),
      }
    : {}),
});

/**
 * Creates an object representing a multiline based on the number of input rows.
 *
 * @param inputRows - The number of input rows.
 * @returns - The multiline object.
 *
 */
const multiline = (inputRows: number) => ({
  multiline: inputRows > 1,
  rows: inputRows,
});

/**
 * Retrieves the current caret position within an HTML input or textarea element.
 *
 * @param element - The input or textarea element.
 * @returns - The current caret position.
 */
const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

/**
 * Variable representing a text input component with various properties and functionalities.
 * @typedef  Text
 * @property invalid - Indicates if the input value is invalid.
 * @property incorrect - Indicates if the input value is incorrect.
 * @property value - The current value of the input.
 * @property disabled - Indicates if the input is disabled.
 * @property readonly - Indicates if the input is read-only.
 * @property inputType - The type of the input. Defaults to "text".
 * @property inputMode - The mode of the input. Defaults to "text".
 * @property inputPattern - The pattern of the input.
 * @property labelShrink - Indicates if the label should shrink.
 * @property description - The description of the input.
 * @property outlined - Indicates if the input is outlined.
 * @property title - The title of the input.
 * @property leadingIcon - The leading icon of the input.
 * @property trailingIcon - The trailing icon of the input.
 * @property leadingIconClick - The click event handler for the leading icon.
 * @property trailingIconClick - The click event handler for the trailing icon.
 * @property leadingIconRipple - Indicates if the leading icon should have a ripple effect. Defaults to true.
 * @property trailingIconRipple - Indicates if the trailing icon should have a ripple effect. Defaults to true.
 * @property inputRows - The number of rows for a multiline input. Defaults to 1.
 * @property placeholder - The placeholder text for the input.
 * @property inputAutocomplete - The autocomplete attribute for the input. Defaults to "off".
 * @property inputFormatterSymbol - The symbol used for formatting the input. Defaults to "0".
 * @property inputFormatterAllowed - An array of characters that are allowed in the formatted input.
 * @property inputFormatterReplace - An array of characters that should be replaced in the formatted input.
 * @property inputFormatterTemplate - The template for formatting the input.
 * @property inputFormatter - A formatter function for the input value.
 * @property dirty - Indicates if the input value has been changed.
 * @property loading - Indicates if the input is currently loading.
 * @property autoFocus - Indicates if the input should be focused automatically.
 * @property inputRef - A ref callback for the input element.
 * @property onChange - The change event handler for the input.
 */
export const Text = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputMode = "text",
  inputPattern = undefined,
  labelShrink,
  description = "",
  outlined = false,
  title = "",
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  leadingIconTabIndex,
  trailingIconTabIndex,
  leadingIconRipple: lir = true,
  trailingIconRipple: tir = true,
  inputRows: rows = 1,
  placeholder = "",
  inputAutocomplete: autoComplete = "off",
  inputFormatterSymbol: symbol = "0",
  inputFormatterAllowed: allowed,
  inputFormatterReplace: replace,
  inputFormatterTemplate: template = "",
  inputFormatter = (raw) =>
    formatText(raw, template, {
      symbol,
      allowed,
      replace,
    }),
  dirty,
  loading,
  autoFocus,
  inputRef,
  onChange,
}: ITextSlot) => {
  const payload = useOnePayload();
  const { object, changeObject: handleChange } = useOneState<object>();

  const inputElementRef = useRef<HTMLInputElement | null>();

  /**
   * Represents a caret manager for handling caret position in an input element.
   * @typedef CaretManager
   * @property render - Renders the caret position in the input element.
   * @property pos - Gets the current caret position in the input element.
   */
  const caretManager = useMemo(() => {
    let lastPos: symbol | number = NEVER_POS;

    /**
     * Calculates the adjustment for the cursor based on the position of a character in the template.
     * The adjustment value represents the number of characters to skip before reaching the desired position.
     *
     * @param pos - The position of the character in the template. Must be a non-negative integer.
     * @returns The adjustment value.
     */
    const getAdjust = (pos: number) => {
      let adjust = 0;
      for (let i = Math.max(pos - 1, 0); i < template.length; i++) {
        const char = template[i];
        if (char === symbol) {
          break;
        }
        adjust += 1;
      }
      return adjust;
    };

    return {
      render: () => {
        if (inputType !== "text") {
          return;
        }
        const { current: input } = inputElementRef;
        if (typeof lastPos === "number") {
          input?.setSelectionRange(lastPos, lastPos);
          lastPos = NEVER_POS;
        }
      },
      pos: () => {
        const { current: input } = inputElementRef;
        if (input) {
          lastPos = getCaretPos(input);
          lastPos += getAdjust(lastPos);
        }
        return lastPos;
      },
    };
  }, []);

  useLayoutEffect(() => {
    if (!template) {
      return;
    }
    const { current: input } = inputElementRef;
    const handler = () => caretManager.pos();
    input && input.addEventListener("keyup", handler);
    input && input.addEventListener("click", handler);
    return () => {
      input && input.removeEventListener("keyup", handler);
      input && input.removeEventListener("click", handler);
    };
  }, [inputElementRef.current]);

  useLayoutEffect(() => {
    if (template || replace || allowed) {
      caretManager.render();
    }
  }, [value]);

  return (
    <MatTextField
      sx={{
        ...(!outlined && {
          position: "relative",
          mt: 1,
          "& .MuiFormHelperText-root": {
            position: "absolute",
            top: "100%",
          },
        }),
      }}
      inputRef={(input: HTMLInputElement | null) => {
        inputElementRef.current = input;
        inputRef && inputRef(input);
      }}
      variant={outlined ? "outlined" : "standard"}
      helperText={(dirty && (invalid || incorrect)) || description}
      error={dirty && (invalid !== null || incorrect !== null)}
      InputProps={{
        autoComplete: autoComplete,
        readOnly: readonly,
        inputMode,
        autoFocus,
        ...icons(
          object,
          payload,
          li,
          ti,
          lic,
          tic,
          leadingIconTabIndex,
          trailingIconTabIndex,
          loading,
          disabled,
          !!readonly,
          (value || "").toString(),
          onChange,
          handleChange,
          lir,
          tir
        ),
      }}
      inputProps={{
        pattern: inputPattern,
      }}
      InputLabelProps={
        labelShrink
          ? {
              shrink: labelShrink,
            }
          : undefined
      }
      type={inputType}
      focused={autoFocus}
      autoComplete={autoComplete}
      value={loading ? LOADING_LABEL : String(value || "")}
      placeholder={placeholder}
      onChange={({ target }) => {
        let result = target.value;
        if (template || replace || allowed) {
          result = "";
          for (let i = 0; i < target.value.length; i++) {
            result += target.value[i];
            result = inputFormatter(result);
          }
          caretManager.pos();
        }
        onChange(result);
      }}
      label={title}
      disabled={disabled}
      {...multiline(rows)}
    />
  );
};

export default Text;
