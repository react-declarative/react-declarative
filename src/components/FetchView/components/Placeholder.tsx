import * as React from 'react';

import { SxProps } from '@mui/material';
import { red } from '@mui/material/colors';

import Box from '@mui/material/Box';

/**
 * Creates a placeholder component.
 *
 * @param text - The text to display in the placeholder.
 * @param [sx] - Additional styling properties for the placeholder component.
 * @returns A function that returns a placeholder component.
 */
const createPlaceholder = (text: string, sx?: SxProps) => () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 400,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: 'text.secondary',
            ...sx,
        }}
    >
        {text}
    </Box>
);

/**
 * Creates a placeholder for displaying an error message.
 *
 * @param errorMessage - The error message to be displayed in the placeholder.
 * @param options - The options for customizing the placeholder.
 * @param options.color - The color of the placeholder text.
 * @param options.fontWeight - The font weight of the placeholder text.
 * @param options.fontSize - The font size of the placeholder text.
 *
 * @returns The created error placeholder.
 */
export const ErrorPlaceholder = createPlaceholder('An error acquired', {
    color: red[500],
    fontWeight: 500,
    fontSize: 24,
});

export const LoaderPlaceholder = createPlaceholder('Loading data');
