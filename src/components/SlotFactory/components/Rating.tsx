import * as React from 'react';

import Box from "@mui/material/Box";
import MatRating from '@mui/material/Rating';
import Typography from "@mui/material/Typography";

import { IRatingSlot } from '../../../slots/RatingSlot';

export const Rating = ({
    value,
    disabled,
    readonly,
    title,
    name,
    onChange,
}: IRatingSlot) => (
    <Box
        display="flex"
        justifyContent="center"
        component="fieldset"
        borderColor="transparent"
    >
        <Typography component="legend">{title}</Typography>
        <MatRating
            name={name}
            onChange={({ }, v) => onChange(v)}
            disabled={disabled}
            value={Number(value)}
            readOnly={readonly}
        />
    </Box>
);

export default Rating;
