import * as React from 'react';

import { useMemo } from 'react';

import { ThemeProvider as MatThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

/**
 * Represents the props for the ThemeProvider component.
 */
interface IThemeProviderProps {
    children: React.ReactNode;
}

/**
 * A component that provides a theme to its child components.
 *
 * @param props - The component props.
 * @param props.children - The child components.
 * @returns The wrapped child components with the provided theme.
 */
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
