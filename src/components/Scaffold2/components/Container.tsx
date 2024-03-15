import * as React from "react";
import { useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import ThemeProvider from "./ThemeProvider";

import Navigator from "./Navigator";
import Header from "./Header";

import usePropsContext from "../context/PropsContext";

import { IScaffold2InternalProps } from "../model/IScaffold2Props";
import Payload from "../model/Payload";

import { DRAWER_WIDTH } from "../config";

/**
 * Container represents a layout component that displays a navigation drawer and main content area.
 * It is used to create a scaffold for building applications with a sidebar navigation and a main content area.
 *
 * @param Container - The props object for the Container component.
 * @param [Container.className] - The additional class name for the root element of the Container.
 * @param [Container.style] - The inline style object for the root element of the Container.
 * @param [Container.sx] - The additional CSS styles for the root element of the Container using the sx prop of Material-UI.
 * @param [Container.options] - An array of option objects representing the navigation items to be displayed in the sidebar.
 * @param [Container.activeOptionPath] - The path of the currently active option in the sidebar.
 * @param [Container.activeTabPath] - The path of the currently active tab in the header. Default value is the same as activeOptionPath.
 * @param [Container.actions] - An object containing action functions to be passed to the Header component.
 * @param [Container.payload] - The payload object to be passed to the Header and Navigator components.
 * @param [Container.loading] - A boolean flag indicating whether the page is currently loading.
 * @param [Container.appName] - The name of the application to be displayed in the header.
 * @param [Container.noAppName] - A boolean flag indicating whether to hide the application name in the header.
 * @param [Container.noSearch] - A boolean flag indicating whether to hide the search input field in the header.
 * @param [Container.BeforeSearch] - A component to be rendered before the search input field in the header.
 * @param [Container.AfterSearch] - A component to be rendered after the search input field in the header.
 * @param [Container.BeforeMenuContent] - A component to be rendered before the menu content in the header.
 * @param [Container.AfterMenuContent] - A component to be rendered after the menu content in the header.
 * @param [Container.Copyright] - A component to be rendered in the footer of the Container.
 * @param [Container.BeforeContent] - A component to be rendered before the main content area of the Container.
 * @param [Container.AfterContent] - A component to be rendered after the main content area of the Container.
 * @param [Container.onOptionGroupClick] - A function that will be called when an option group in the sidebar is clicked.
 * @param [Container.onOptionClick] - A function that will be called when an option in the sidebar is clicked.
 * @param [Container.onTabChange] - A function that will be called when the active tab in the header is changed. Default value is the same as onOptionClick.
 * @param [Container.onAction] - A function that will be called when an action button in the header is clicked.
 * @param [Container.children] - The content to be rendered in the main content area of the Container.
 * @returns The rendered Container component.
 */
export const Container = <T extends Payload = Payload>({
  className,
  style,
  sx,
  options,
  activeOptionPath,
  activeTabPath = activeOptionPath,
  actions,
  payload,
  loading,
  appName,
  noAppName,
  noSearch,
  BeforeSearch,
  AfterSearch,
  BeforeMenuContent,
  AfterMenuContent,
  Copyright,
  BeforeContent,
  AfterContent,
  onOptionGroupClick,
  onOptionClick,
  onTabChange = onOptionClick,
  onAction,
  children,
}: IScaffold2InternalProps<T>) => {
  const { dense, noContent } = usePropsContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const handleDrawerToggle = () => {
    setMobileOpen((mobileOpen) => !mobileOpen);
  };

  const handleOptionGroupClick = (path: string, id: string) => {
    if (onOptionGroupClick) {
      const mobileOpen = onOptionGroupClick(path, id);
      setMobileOpen(!!mobileOpen);
    } else {
      setMobileOpen(false);
    }
  };

  const handleOptionClick = (path: string, id: string) => {
    if (onOptionClick) {
      const mobileOpen = onOptionClick(path, id);
      setMobileOpen(!!mobileOpen);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <ThemeProvider>
      <Box
        className={className}
        style={style}
        sx={{
          position: 'relative',
          display: "flex",
          minHeight: "100vh",
          ...sx
        }}
      >
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: !dense ? { sm: DRAWER_WIDTH } : undefined, flexShrink: { sm: 0 } }}
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
              BeforeContent={BeforeContent}
              AfterContent={AfterContent}
              onClose={handleDrawerToggle}
              onOptionGroupClick={handleOptionGroupClick}
              onOptionClick={handleOptionClick}
              onOpen={() => setMobileOpen(true)}
            />
          )}
          {!isMobile && (
            <Navigator<T>
              open
              disableSwipeToOpen
              disableDiscovery
              PaperProps={{ style: { width: DRAWER_WIDTH } }}
              sx={{ display: { sm: "block", xs: "none" }, width: DRAWER_WIDTH }}
              activeOptionPath={activeOptionPath}
              payload={payload}
              options={options}
              appName={appName}
              noAppName={noAppName}
              noSearch={noSearch}
              BeforeSearch={BeforeSearch}
              AfterSearch={AfterSearch}
              BeforeContent={BeforeContent}
              AfterContent={AfterContent}
              onOptionGroupClick={handleOptionGroupClick}
              onOptionClick={handleOptionClick}
              onOpen={() => {}}
              onClose={() => {}}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header<T>
            payload={payload}
            options={options}
            actions={actions}
            loading={loading}
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
        {!!noContent && (
          <Box
            sx={{
              position: 'absolute',
              height: '100vh',
              width: '100vw',
              top: 0,
              left: 0,
              zIndex: 9999,
              background: (theme) => theme.palette.background.default,
            }}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Container;
