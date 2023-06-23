import * as React from 'react';
import { useMemo } from 'react';

import MatChip, { ChipProps } from '@mui/material/Chip';
import { createTheme, Theme, ThemeProvider, useTheme } from '@mui/material';

interface IChipProps extends Omit<ChipProps, keyof {
    color: never;
}> {
    color?: string;
}

export const Chip = ({
    color,
    ...otherProps
}: IChipProps) => {

    const theme = useTheme<Theme>();

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
