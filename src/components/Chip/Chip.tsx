import * as React from 'react';
import { useMemo } from 'react';

import MatChip, { ChipProps } from '@mui/material/Chip';
import { createTheme, Theme, ThemeProvider, useTheme } from '@mui/material';

/**
 * Interface for extending the `ChipProps` with an optional `color` property.
 */
interface IChipProps extends Omit<ChipProps, keyof {
    color: never;
}> {
    color?: string;
}

/**
 * Represents a Chip component with customized color.
 *
 * @param props - The props passed to the Chip component.
 * @param props.color - The color of the chip. Overrides the primary color of the theme.
 * @param props.otherProps - Additional props passed to the underlying MatChip component.
 * @param props.otherProps - Additional props passed to the underlying MatChip component.
 *
 * @returns The rendered Chip component.
 */
export const Chip = ({
    color,
    ...otherProps
}: IChipProps) => {

    const theme = useTheme<Theme>();

    /**
     * Creates a chip theme using the provided theme and color.
     *
     * @param {object} theme - The base theme object.
     * @param {string} color - The color to be used as the primary color of the chip theme.
     * @returns {object} The chip theme object.
     */
    const chipTheme = useMemo(() => createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            primary: {
                main: color || theme.palette.primary.main,
            },
        },
    }), [theme, color]);

    return (
        <ThemeProvider theme={chipTheme}>
            <MatChip variant="outlined" {...otherProps} color="primary" />
        </ThemeProvider>
    );
};

export default Chip;
