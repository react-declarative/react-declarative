import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { alpha, darken } from "@mui/material";
import { makeStyles } from "../../styles";

import OutletView, { IOutlet } from "../OutletView";
import PaperView from "../PaperView";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

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
    background:
      theme.palette.mode === "dark"
        ? darken(theme.palette.background.paper, 0.06)
        : alpha("#000", 0.05),
    width: "100%",
  },
  loader: {
    position: "absolute",
    top: HEADER_HEIGHT - LOADER_HEIGHT,
    height: HEADER_HEIGHT,
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
  tabSelected: {
  },
  indicator: {
    height: '4px',
    background: `${theme.palette.primary.main} !important`,
  },
}));

export const TabsView = <Data extends {} = IAnything, Payload = IAnything>({
  className,
  style,
  sx,
  outlinePaper = false,
  history: upperHistory,
  payload: upperPayload = {} as Payload,
  pathname = "/",
  tabs,
  routes,
  onTabChange,
  onLoadStart,
  onLoadEnd,
  ...outletProps
}: ITabsViewProps<Data, Payload>) => {
  const { elementRef, size } = useElementSize();

  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const { history } = useLocalHistory({
    history: upperHistory,
    pathname,
  });

  const [path, setPath] = useState(history.location.pathname);

  const lastActiveStep = useRef(-1);

  const otherProps = useMemo(
    (): OtherProps => ({
      size,
    }),
    [size.height, size.width]
  );

  useEffect(
    () =>
      history.listen(({ location, action }) => {
        if (action === "REPLACE") {
          setPath(location.pathname);
        }
      }),
    []
  );

  const activeStep = useMemo(() => {
    const route = routes.find(({ isActive }) => isActive(path));
    if (!route) {
      return -1;
    }
    const activeStep = tabs.findIndex(({ id }) => id === route.id);
    if (activeStep === -1) {
      return lastActiveStep.current;
    }
    return (lastActiveStep.current = activeStep);
  }, [path]);

  return (
    <PaperView
      outlinePaper={outlinePaper}
      className={classNames(classes.root, className)}
      style={style}
      sx={sx}
    >
      <Tabs
        variant="standard"
        className={classes.header}
        classes={{ root: classes.tabsRoot, indicator: classes.indicator }}
        value={activeStep}
        sx={{ background: outlinePaper ? "transparent !important" : "inherit" }}
        onChange={(_, id) => {
          onTabChange(id, history, payload);
        }}
      >
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
      </Tabs>
      <div className={classes.adjust} />
      <Box ref={elementRef} className={classes.content}>
        <OutletView<Data, Payload>
          history={history}
          routes={routes as IOutlet<Data, Payload>[]}
          otherProps={otherProps}
          {...outletProps}
        />
      </Box>
    </PaperView>
  );
};

export default TabsView;
