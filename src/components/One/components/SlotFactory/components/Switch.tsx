import * as React from 'react';

import Box from '@mui/material/Box';
import MatSwitch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { ISwitchSlot } from '../../../slots/SwitchSlot';

export const Switch = ({
    disabled,
    value,
    onChange,
    title,
}: ISwitchSlot) => (
    <Box display="flex" alignItems="center">
        <Box flex={1}>
            <Typography variant="body1">
                {title}
            </Typography>
        </Box>
        <MatSwitch disabled={disabled} checked={Boolean(value)} onChange={(_, checked) => onChange(checked)} />
    </Box>
);

export default Switch;
