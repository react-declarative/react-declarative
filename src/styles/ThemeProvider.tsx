import * as React from 'react';

import { ThemeProvider as MatThemeProvider } from "@mui/styles";
import { DefaultTheme } from "@mui/styles";

import { createTheme } from "@mui/system";

const theme = createTheme();

interface IThemeProviderProps {
    children: React.ReactNode;
}

const handleTheme = (upperTheme: DefaultTheme) => ({
    ...theme,
    ...upperTheme,
});

export const ThemeProvider = ({
    children,
}: IThemeProviderProps) => (
    <MatThemeProvider theme={handleTheme}>
        {children}
    </MatThemeProvider>
);
