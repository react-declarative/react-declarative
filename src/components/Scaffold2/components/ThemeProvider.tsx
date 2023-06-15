import * as React from "react";
import { useMemo } from "react";

import { useTheme } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

interface IThemeProviderProvider {
  children: React.ReactNode;
}

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
