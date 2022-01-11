import * as React from 'react';

import { useMemo } from 'react';

import { ThemeProvider as MatThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

interface IThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({
    children,
}: IThemeProviderProps) => {
    const upperTheme = useTheme();
    const currentTheme = useMemo(() => createTheme(upperTheme), [upperTheme]);
    return (
        <MatThemeProvider theme={currentTheme}>
            {children}
        </MatThemeProvider>
    );
};
