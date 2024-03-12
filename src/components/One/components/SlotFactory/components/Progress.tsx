import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { IProgressSlot } from '../../../slots/ProgressSlot';

const percent = (v: number, m: number) => Math.min(100, Math.round((Math.max(Number(v), 0) / m) * 100));

/**
 * Represents a progress component.
 *
 * @param props - The properties for the Progress component.
 * @param props.maxPercent - The maximum percentage value for the progress.
 * @param props.showPercentLabel - Flag indicating whether to show the percentage label.
 * @param props.value - The current value of the progress.
 * @returns - The Progress component.
 */
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
