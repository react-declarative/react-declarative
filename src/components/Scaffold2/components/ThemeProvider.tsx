import * as React from "react";
import { useMemo } from "react";

import { useTheme } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

/**
 * Represents a theme provider provider for React components.
 * @interface
 */
interface IThemeProviderProvider {
  children: React.ReactNode;
}

/**
 * Component that provides a themed environment for its children.
 *
 * @component
 * @param props - The component props.
 * @param props.children - The children elements to be rendered within the themed environment.
 * @returns The themed environment with its children elements.
 */
export const ThemeProvider = ({ children }: IThemeProviderProvider) => {
  const upperTheme = useTheme();
  const theme = useMemo(() => {
    const theme = createTheme(upperTheme);
    theme.components = {
      ...theme.components,
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            background: theme.palette.mode === 'dark'
              ? theme.palette.primary.main
              : theme.palette.background.default
          },
        },
      },
    };
    return theme;
  }, [upperTheme]);
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
