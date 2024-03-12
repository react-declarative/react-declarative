import * as React from 'react';

import Box from "@mui/material/Box";
import MatRating from '@mui/material/Rating';

import { IRatingSlot } from '../../../slots/RatingSlot';

/**
 * Represents a Rating component.
 *
 * @typedef  IRatingSlot
 * @property value - The current value of the rating component.
 * @property disabled - Determines if the rating component is disabled or not.
 * @property readonly - Determines if the rating component is readonly or not.
 * @property onChange - The event handler function that will be called when the rating value changes.
 */
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
