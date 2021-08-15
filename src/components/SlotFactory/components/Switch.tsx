import * as React from 'react';

import Box from '@material-ui/core/Box';
import MatSwitch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

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
        <MatSwitch disabled={disabled} checked={Boolean(value)} onChange={() => onChange(!value)} />
    </Box>
);

export default Switch;
