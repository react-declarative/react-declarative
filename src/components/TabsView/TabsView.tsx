import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { alpha, darken } from "@mui/material";
import { makeStyles } from "../../styles";

import OutletView, { IOutlet } from "../OutletView";
import PaperView from "../PaperView";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import LinearProgress from "@mui/material/LinearProgress";

import ITabsViewProps from "./model/ITabsViewProps";
import { OtherProps } from "./model/ITabsOutlet";
import IAnything from "../../model/IAnything";

import useLocalHistory from "../../hooks/useLocalHistory";
import useElementSize from "../../hooks/useElementSize";
import useSingleton from "../../hooks/useSingleton";

import classNames from "../../utils/classNames";

const HEADER_HEIGHT = 48;
const LOADER_HEIGHT = 4;

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    width: "100%",
    minHeight: 365,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: 0,
    height: `${HEADER_HEIGHT}px`,
    width: "100%",
  },
  headerBg: {
    background:
      theme.palette.mode === "dark"
        ? darken(theme.palette.background.paper, 0.06)
        : alpha("#000", 0.05),
  },
  loader: {
    position: "absolute",
    top: HEADER_HEIGHT - LOADER_HEIGHT,
    height: `${LOADER_HEIGHT}px`,
    zIndex: 2,
    left: 0,
    width: "100%",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *:nth-of-type(1)": {
      flex: 1,
    },
  },
  adjust: {
    minHeight: HEADER_HEIGHT,
    maxHeight: HEADER_HEIGHT,
  },
  tabsRoot: {
    minHeight: HEADER_HEIGHT,
    height: HEADER_HEIGHT,
    marginLeft: "0 !important",
    marginRight: "0 !important",
  },
  tabRoot: {
    minHeight: HEADER_HEIGHT,
    height: HEADER_HEIGHT,
  },
  tabSelected: {},
  indicator: {
    height: "4px",
    background: `${theme.palette.primary.main} !important`,
  },
}));

export const TabsView = <Data extends {} = IAnything, Payload = IAnything>({
  className,
  style,
  sx,
  outlinePaper = false,
  transparentPaper = false,
  transparentHeader = false,
  history: upperHistory,
  payload: upperPayload = {} as Payload,
  pathname = "/",
  tabs: upperTabs,
  routes,
  onTabChange,
  onLoadStart,
  onLoadEnd,
  BeforeTabs,
  AfterTabs,
  otherProps: upperOtherProps = {},
  ...outletProps
}: ITabsViewProps<Data, Payload>) => {
  const { elementRef, size } = useElementSize();

  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const tabs = useMemo(
    () => upperTabs.filter(({ isVisible = () => true }) => isVisible(payload)),
    []
  );

  const { history } = useLocalHistory({
    history: upperHistory,
    pathname,
  });

  const [path, setPath] = useState(history.location.pathname);
  const [loading, setLoading] = useState(0);
  const [progress, setProgress] = useState(0);

  const lastActiveStep = useRef(-1);

  const otherProps = useMemo(
    (): OtherProps => ({
      size,
      loading: !!loading,
      progress,
      setLoading: (isLoading) => {
        setLoading((loading) => Math.max(loading + (isLoading ? 1 : -1), 0));
        setProgress(0);
      },
      setProgress: (progress) => {
        setLoading(0);
        setProgress(progress);
      },
      ...upperOtherProps,
    }),
    [size.height, size.width]
  );

  useEffect(
    () =>
      history.listen(({ location, action }) => {
        if (action === "REPLACE") {
          setPath(location.pathname);
          setLoading(0);
          setProgress(0);
        }
      }),
    []
  );

  const activeStep = useMemo(() => {
    const route = routes.find(({ isActive }) => isActive(path));
    if (!route) {
      return -1;
    }
    const activeStep = tabs.findIndex(
      ({ isMatch = () => false, id }) => id === route.id || isMatch(route.id)
    );
    if (activeStep === -1) {
      return lastActiveStep.current;
    }
    return (lastActiveStep.current = activeStep);
  }, [path]);

  const renderLoader = useCallback(() => {
    if (progress) {
      return (
        <LinearProgress
          className={classes.loader}
          value={progress}
          variant="determinate"
        />
      );
    }
    if (loading) {
      return (
        <LinearProgress className={classes.loader} variant="indeterminate" />
      );
    }
    return null;
  }, [loading, progress]);

  return (
    <PaperView
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
      className={classNames(classes.root, className)}
      style={style}
      sx={sx}
    >
      <Tabs
        variant="standard"
        className={classNames(classes.header, {
          [classes.headerBg]: !transparentHeader,
        })}
        classes={{ root: classes.tabsRoot, indicator: classes.indicator }}
        value={activeStep}
        sx={{ background: outlinePaper || transparentPaper ? "transparent !important" : "inherit" }}
        onChange={(_, idx) => {
          onTabChange(tabs[idx].id!, history, payload);
        }}
      >
        {BeforeTabs && <BeforeTabs />}
        {tabs.map(({ label, icon: Icon }, idx) => (
          <Tab
            key={idx}
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected,
            }}
            label={label}
            icon={Icon && <Icon />}
          />
        ))}
        {AfterTabs && <AfterTabs />}
      </Tabs>
      {renderLoader()}
      <div className={classes.adjust} />
      <Box ref={elementRef} className={classes.content}>
        <OutletView<Data, Payload>
          history={history}
          routes={routes as IOutlet<Data, Payload>[]}
          otherProps={otherProps}
          payload={payload}
          {...outletProps}
        />
      </Box>
    </PaperView>
  );
};

export default TabsView;
