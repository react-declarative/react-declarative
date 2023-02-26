import * as React from "react";
import { useMemo } from "react";

import { useTheme } from "@mui/material";
import {
  ThemeProvider as MuiThemeProvider,
  darken,
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
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darken(theme.palette.background.paper, 0.06),
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
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
