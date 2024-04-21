import * as React from "react";
import { useEffect, useMemo, useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import ThemeProvider from "./ThemeProvider";

import NavigatorOpened from "./NavigatorOpened";
import NavigatorDense from "./NavigatorDense";
import Header from "./Header";

import usePropsContext from "../context/PropsContext";
import useWindowSize from "../../../hooks/useWindowSize";

import { IScaffold3InternalProps } from "../model/IScaffold3Props";
import Payload from "../model/Payload";

import Drawer from "./Drawer";
import { CLOSED_WIDTH } from "../config";

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
}: IScaffold3InternalProps<T>) => {
  
  const theme = useTheme();
  const size = useWindowSize();
  const isMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  useEffect(() => {
    if (!isMobile) {
      setOpened(true);
    }
  }, [isMobile]);

  const { noContent } = usePropsContext();
  const [opened, setOpened] = useState(!isMobile);
  const [, setSwiping] = useState(false);

  const widthRequest = useMemo(() => {
    return size.width - CLOSED_WIDTH;
  }, [size.width]);

  /**
   * Toggles the mobile drawer state.
   *
   * @function
   * @name handleDrawerToggle
   * @returns
   */
  const handleDrawerToggle = () => {
    setOpened((opened) => !opened);
  };

  /**
   * Handles the click event of an option group.
   *
   * @param path - The path of the option group.
   * @param id - The ID of the option group.
   *
   * @returns
   */
  const handleOptionGroupClick = (path: string, id: string) => {
    if (onOptionGroupClick) {
      const mobileOpen = onOptionGroupClick(path, id);
      opened && setOpened(isMobile ? !!mobileOpen : false);
    } else {
      setOpened(false);
    }
  };

  /**
   * Handles the click event for an option.
   *
   * @param path - The path of the option.
   * @param id - The identifier of the option.
   * @returns
   */
  const handleOptionClick = (path: string, id: string) => {
    if (onOptionClick) {
      const mobileOpen = onOptionClick(path, id);
      opened && setOpened(isMobile ? !!mobileOpen : false);
    } else {
      setOpened(false);
    }
  };

  const renderNavigation = () => {
    if (opened || !isMobile) {
      return (
        <NavigatorOpened<T>
          activeOptionPath={activeOptionPath}
          options={options}
          payload={payload}
          appName={appName}
          noAppName={noAppName}
          noSearch={noSearch}
          BeforeSearch={BeforeSearch}
          AfterSearch={AfterSearch}
          BeforeContent={BeforeContent}
          AfterContent={AfterContent}
          onOptionGroupClick={handleOptionGroupClick}
          onOptionClick={handleOptionClick}
        />
      );
    }
    return (
      <NavigatorDense
        options={options}
        onOptionGroupClick={handleOptionGroupClick}
        onOptionClick={handleOptionClick}
      />
    )
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
          flexDirection: 'row',
          overflowX: 'hidden',
          ...sx
        }}
      >
        <CssBaseline />
        <Drawer variant={isMobile ? "temporary" : "permanent"} opened={opened || !isMobile} onOpenChange={setOpened} onSwipingChange={setSwiping}>
          {renderNavigation()}
        </Drawer>
        <Box sx={{ flex: 1, display: "flex", slignItems: 'stretch', justifyContent: 'stretch', maxWidth: widthRequest, '& > *': { maxWidth: widthRequest } }}>
          <Box sx={{ display: 'flex', flexDirection: "column", flex: 1, position: 'relative' }}>
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
        </Box>
        {!!noContent && (
          <Box
            sx={{
              position: 'absolute',
              height: '100vh',
              width: '100vw',
              top: 0,
              left: 0,
              zIndex: 999,
              background: (theme) => theme.palette.background.default,
            }}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Container;
