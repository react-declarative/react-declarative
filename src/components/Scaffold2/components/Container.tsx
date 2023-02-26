import * as React from "react";
import { useMemo, useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import ThemeProvider from "./ThemeProvider";

import Navigator from "./Navigator";
import Header from "./Header";

import useMediaContext from "../../../hooks/useMediaContext";

import { IScaffold2InternalProps } from "../model/IScaffold2Props";
import Payload from "../model/Payload";

import { DRAWER_WIDTH } from "../config";

export const Container = <T extends Payload = Payload>({
  className,
  style,
  sx,
  options,
  activeOption,
  actions,
  payload,
  appName,
  BeforeMenuContent,
  AfterMenuContent,
  Copyright,
  onOptionGroupClick,
  onOptionClick,
  onAction,
  children,
}: IScaffold2InternalProps<T>) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mediaContext = useMediaContext();

  const isMobile = useMemo(() => {
    let isMobile = false;
    isMobile = isMobile || mediaContext.isPhone;
    isMobile = isMobile || mediaContext.isTablet;
    isMobile = isMobile || mediaContext.isDesktop;
    return isMobile;
  }, [mediaContext.isPhone, mediaContext.isTablet, mediaContext.isDesktop]);

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
              options={options}
              activeOption={activeOption}
              payload={payload}
              appName={appName}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onOptionGroupClick={onOptionGroupClick}
              onOptionClick={onOptionClick}
            />
          )}
          <Navigator<T>
            PaperProps={{ style: { width: DRAWER_WIDTH } }}
            sx={{ display: { sm: "block", xs: "none" } }}
            payload={payload}
            options={options}
            activeOption={activeOption}
            appName={appName}
            onOptionGroupClick={onOptionGroupClick}
            onOptionClick={onOptionClick}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header<T>
            payload={payload}
            options={options}
            actions={actions}
            BeforeMenuContent={BeforeMenuContent}
            AfterMenuContent={AfterMenuContent}
            activeOption={activeOption}
            onDrawerToggle={handleDrawerToggle}
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
