import * as React from "react";
import { useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import ThemeProvider from "./ThemeProvider";

import Navigator from "./Navigator";
import Header from "./Header";

import { IScaffold2InternalProps } from "../model/IScaffold2Props";
import Payload from "../model/Payload";

import { DRAWER_WIDTH } from "../config";

export const Container = <T extends Payload = Payload>({
  className,
  style,
  sx,
  options,
  activeOptionPath,
  activeTabId,
  actions,
  payload,
  appName,
  BeforeMenuContent,
  AfterMenuContent,
  Copyright,
  onOptionGroupClick,
  onOptionClick,
  onTabChange,
  onAction,
  children,
}: IScaffold2InternalProps<T>) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const handleDrawerToggle = () => {
    setMobileOpen((mobileOpen) => !mobileOpen);
  };

  return (
    <ThemeProvider>
      <Box
        className={className}
        style={style}
        sx={{ display: "flex", minHeight: "100vh", ...sx }}
      >
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        >
          {isMobile && (
            <Navigator<T>
              PaperProps={{ style: { width: DRAWER_WIDTH } }}
              activeOptionPath={activeOptionPath}
              options={options}
              payload={payload}
              appName={appName}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onOptionGroupClick={onOptionGroupClick}
              onOptionClick={onOptionClick}
            />
          )}
          {!isMobile && (
            <Navigator<T>
              PaperProps={{ style: { width: DRAWER_WIDTH } }}
              sx={{ display: { sm: "block", xs: "none" } }}
              activeOptionPath={activeOptionPath}
              payload={payload}
              options={options}
              appName={appName}
              onOptionGroupClick={onOptionGroupClick}
              onOptionClick={onOptionClick}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header<T>
            payload={payload}
            options={options}
            actions={actions}
            isMobile={isMobile}
            BeforeMenuContent={BeforeMenuContent}
            AfterMenuContent={AfterMenuContent}
            activeOptionPath={activeOptionPath}
            activeTabId={activeTabId}
            onDrawerToggle={handleDrawerToggle}
            onTabChange={onTabChange}
            onAction={onAction}
          />
          <Box component="main" sx={{ flex: 1, p: 1 }}>
            {children}
          </Box>
          {!!Copyright && (
            <Box component="footer" sx={{ p: 2 }}>
              <Copyright />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Container;
