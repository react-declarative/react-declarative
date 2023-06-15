import * as React from 'react';

import Box from '@mui/material/Box';
import MatSwitch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { ISwitchSlot } from '../../../slots/SwitchSlot';

export const Switch = ({
    disabled,
    readonly,
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
        <MatSwitch
            disabled={disabled}
            checked={Boolean(value)}
            onChange={(_, checked) => {
                if (!readonly) {
                    onChange(checked)
                }
            }}
        />
    </Box>
);

export default Switch;
