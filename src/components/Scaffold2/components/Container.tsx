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
  activeTabPath = activeOptionPath,
  actions,
  payload,
  loader,
  appName,
  noAppName,
  noSearch,
  BeforeSearch,
  AfterSearch,
  BeforeMenuContent,
  AfterMenuContent,
  Copyright,
  onOptionGroupClick,
  onOptionClick,
  onTabChange = onOptionClick,
  onAction,
  children,
}: IScaffold2InternalProps<T>) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const handleDrawerToggle = () => {
    setMobileOpen((mobileOpen) => !mobileOpen);
  };

  const handleOptionGroupClick = (path: string, id: string) => {
    setMobileOpen(false);
    onOptionGroupClick && onOptionGroupClick(path, id);
  };

  const handleOptionClick = (path: string, id: string) => {
    setMobileOpen(false);
    onOptionClick && onOptionClick(path, id);
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
              noAppName={noAppName}
              noSearch={noSearch}
              variant="temporary"
              open={mobileOpen}
              BeforeSearch={BeforeSearch}
              AfterSearch={AfterSearch}
              onClose={handleDrawerToggle}
              onOptionGroupClick={handleOptionGroupClick}
              onOptionClick={handleOptionClick}
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
              noAppName={noAppName}
              noSearch={noSearch}
              BeforeSearch={BeforeSearch}
              AfterSearch={AfterSearch}
              onOptionGroupClick={handleOptionGroupClick}
              onOptionClick={handleOptionClick}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header<T>
            payload={payload}
            options={options}
            actions={actions}
            loader={loader}
            appName={appName}
            isMobile={isMobile}
            BeforeMenuContent={BeforeMenuContent}
            AfterMenuContent={AfterMenuContent}
            activeOptionPath={activeOptionPath}
            activeTabPath={activeTabPath}
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
