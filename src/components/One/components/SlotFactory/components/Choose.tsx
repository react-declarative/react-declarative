import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from '../../../../../styles';

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import ActionButton from "../../../../ActionButton";
import Async from "../../../../Async";

import useSinglerunAction from "../../../../../hooks/useSinglerunAction";
import useReloadTrigger from "../../../../../hooks/useReloadTrigger";

import classNames from "../../../../../utils/classNames";

import { IChooseSlot } from "../../../slots/ChooseSlot";

const useStyles = makeStyles()({
  input: {
    pointerEvents: 'all',
  },
});

export const Choose = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  description = "",
  outlined = true,
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
  const { classes } = useStyles();

  const payload = useOnePayload();
  const { object } = useOneState();

  const { doReload, reloadTrigger } = useReloadTrigger();

  const { execute: handleClick, loading: currentLoading } = useSinglerunAction(
    async () => {
      if (value) {
        onChange(null);
        return;
      }
      const pendingValue = await choose(object, payload);
      onChange(pendingValue);
    }
  );

  const Input: React.FC<any> = forwardRef(({ value, ...rest }, ref) => (
    <Async
      payload={value}
      Loader={() => (
        <input
          {...rest}
          readOnly
          ref={ref}
          value=""
          placeholder="Loading..."
          type="text"
        />
      )}
    >
      {async () => {
        const label = value
          ? (await tr(value, object, payload)) || "unset"
          : "";
        return (
          <input
            {...rest}
            readOnly
            ref={ref}
            value={label}
            type="text"
          />
        );
      }}
    </Async>
  ));

  const loading = upperLoading || currentLoading;

  return (
    <TextField
      key={reloadTrigger}
      className={classNames({
        [classes.input]: !readonly,
      })}
      sx={{
        flex: 1,
        pointerEvents: "none",
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
      variant={outlined ? "outlined" : "standard"}
      helperText={(dirty && (invalid || incorrect)) || description}
      error={dirty && (invalid !== null || incorrect !== null)}
      InputProps={{
        readOnly: true,
        inputComponent: Input,
        placeholder,
        endAdornment: (
          <InputAdornment position="end">
            <ActionButton
              sx={{
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
      InputLabelProps={
        labelShrink
          ? {
              shrink: labelShrink,
            }
          : undefined
      }
      value={value || ""}
      placeholder={placeholder}
      label={title}
      disabled={disabled}
    />
  );
};

export default Choose;
