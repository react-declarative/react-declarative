import * as React from 'react';

import Box from "@mui/material/Box";
import MatRating from '@mui/material/Rating';

import { IRatingSlot } from '../../../slots/RatingSlot';

export const Rating = ({
    value,
    disabled,
    readonly,
    onChange,
}: IRatingSlot) => (
    <Box
        display="flex"
        justifyContent="center"
        component="fieldset"
        borderColor="transparent"
    >
        <MatRating
            onChange={({ }, v) => onChange(v)}
            disabled={disabled}
            value={Number(value)}
            readOnly={readonly}
        />
    </Box>
);

export default Rating;
