import * as React from 'react';
import { useState } from 'react';

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import CloseIcon from '@mui/icons-material/Close';

import ActionButton from '../../../../ActionButton';

import { IFileSlot } from '../../../slots/FileSlot';

import { useOnePayload } from '../../../context/PayloadProvider';
import { useOneState } from '../../../context/StateProvider';

import chooseFile from '../../../../../utils/chooseFile';

const LOADING_LABEL = 'Loading';

export const Text = ({
    invalid,
    value,
    disabled,
    readonly,
    description = "",
    outlined = true,
    title = "",
    placeholder = "No file chosen",
    dirty,
    loading: upperLoading,
    inputRef,
    onChange,
    fileAccept,
    upload = (file) => {
        if (file instanceof File) {
            return file.name;
        }
        return name;
    },
    name,
}: IFileSlot) => {
    const [currentLoading, setCurrentLoading] = useState(false);
    const payload = useOnePayload();
    const { object } = useOneState();

    const loading = upperLoading || currentLoading;

    return (
        <Stack direction="row" alignItems={outlined ? "stretch" : "center"} spacing={1}>
            <TextField
                sx={{ flex: 1 }}
                name={name}
                inputRef={inputRef}
                variant={outlined ? "outlined" : "standard"}
                helperText={(dirty && invalid) || description}
                error={dirty && invalid !== null}
                InputProps={{
                    readOnly: readonly,
                    endAdornment: (
                        <InputAdornment position="end">
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
                value={loading ? LOADING_LABEL : value ? String(value) : ""}
                placeholder={placeholder}
                label={title}
                disabled={disabled}
            />
            <ActionButton
                variant="outlined"
                onLoadStart={() => setCurrentLoading(true)}
                onLoadEnd={() => setCurrentLoading(false)}
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
}

export default Text;
