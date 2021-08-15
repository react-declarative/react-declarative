import * as React from 'react';

import Box from "@material-ui/core/Box";
import MatRating from '@material-ui/lab/Rating';
import Typography from "@material-ui/core/Typography";

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
