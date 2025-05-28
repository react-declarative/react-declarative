import * as React from "react";
import { useState } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import useAsyncValue from "../../../../../hooks/useAsyncValue";

import CloseIcon from "@mui/icons-material/Close";

import ActionButton from "../../../../ActionButton";

import { IFileSlot } from "../../../slots/FileSlot";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import chooseFile from "../../../../../utils/chooseFile";

const LOADING_LABEL = "Loading";

/**
 * FileField component is a form field for selecting and displaying a file.
 *
 * @param props - The input props for the FileField component.
 * @param props.invalid - Defines if the file is invalid.
 * @param props.incorrect - Defines if the file is incorrect.
 * @param props.value - The current value of the file field.
 * @param props.disabled - Defines if the file field is disabled.
 * @param props.readonly - Defines if the file field is read-only.
 * @param props.description - The description or helper text of the file field.
 * @param props.outlined - Defines if the file field is outlined.
 * @param props.labelShrink - Defines if the label should shrink.
 * @param props.title - The title or label of the file field.
 * @param props.placeholder - The placeholder for the file field.
 * @param props.dirty - Defines if the file field has been changed.
 * @param props.loading - Defines if the file field is in loading state.
 * @param props.inputRef - A ref to the file field's input element.
 * @param props.onChange - The callback function called when the file value changes.
 * @param props.fileAccept - The accepted file types for file selection.
 * @param props.name - The name of the file field.
 * @param props.upload - The function called when a file is uploaded.
 *   The function takes a file as input and returns the uploaded file's name.
 * @param props.view - The function called when the file is viewed.
 *   The function takes the file path as input.
 * @returns - Returns the JSX element of the FileField component.
 */
export const FileField = ({
  invalid,
  incorrect,
  value: upperValue,
  disabled,
  readonly,
  description = "",
  outlined = false,
  labelShrink,
  title = "",
  placeholder = "No file chosen",
  dirty,
  loading: upperLoading,
  inputRef,
  onChange,
  fileAccept,
  name,
  upload = (file) => {
    if (file instanceof File) {
      return file.name;
    }
    return name;
  },
  view,
  tr = (value: string) => value,
}: IFileSlot) => {
  const [currentLoading, setCurrentLoading] = useState(0);
  const payload = useOnePayload();
  const { object } = useOneState();

  const loading = !!upperLoading || !!currentLoading;

  const [value] = useAsyncValue(async () => {
    return await tr(upperValue, object, payload);
  }, {
    onLoadStart: () => setCurrentLoading(c => c + 1),
    onLoadEnd: () => setCurrentLoading(c => c - 1),
    deps: [upperValue],
  })

  return (
    <Stack
      direction="row"
      alignItems={outlined ? "stretch" : "center"}
      spacing={1}
    >
      <TextField
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
        variant={outlined ? "outlined" : "standard"}
        helperText={(dirty && (invalid || incorrect)) || description}
        error={dirty && (invalid !== null || incorrect !== null)}
        InputProps={{
          readOnly: readonly,
          endAdornment: (
            <InputAdornment sx={{ position: "relative" }} position="end">
              <IconButton
                edge="end"
                disabled={disabled || !value}
                onClick={() => {
                  onChange(null);
                }}
              >
                <CloseIcon />
              </IconButton>
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
        value={loading ? LOADING_LABEL : value ? String(value) : ""}
        placeholder={placeholder}
        label={title}
        disabled={disabled}
      />
      {!!value && !!view && (
        <ActionButton
          variant="outlined"
          onLoadStart={() => setCurrentLoading(c => c + 1)}
          onLoadEnd={() => setCurrentLoading(c => c - 1)}
          onClick={async () => {
            await view(value, object, payload);
          }}
        >
          View
        </ActionButton>
      )}
      <ActionButton
        variant="outlined"
        onLoadStart={() => setCurrentLoading(c => c + 1)}
        onLoadEnd={() => setCurrentLoading(c => c - 1)}
        onClick={async () => {
          const fileBlob = await chooseFile(fileAccept);
          if (fileBlob) {
            const fileName = await upload(fileBlob, object, payload);
            onChange(fileName);
          }
        }}
      >
        {loading && "Uploading"}
        {!loading && "Choose"}
      </ActionButton>
    </Stack>
  );
};

export default FileField;
