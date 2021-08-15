import * as React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { IProgressSlot } from '../../../slots/ProgressSlot';

const percent = (v: number, m: number) => Math.min(100, Math.round((Math.max(Number(v), 0) / m) * 100));

export const Progress = ({
    maxPercent = 1.0,
    showPercentLabel,
    value,
}: IProgressSlot) => (
    <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
            <LinearProgress
                variant="determinate"
                value={percent(Number(value), Number(maxPercent))}
            />
        </Box>
        {showPercentLabel && (
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                    {`${percent(Number(value), Number(maxPercent))}%`}
                </Typography>
            </Box>
        )}
    </Box>
);

export default Progress;
