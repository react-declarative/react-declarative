import * as React from "react";
import { useMemo, useState, useRef, useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { makeStyles } from "../../../../../styles";

import classNames from "../../../../../utils/classNames";

import IContentProps from "../IContentProps";

import { MASTER_DETAIL_ROOT } from "../../../config";

const TAB_HEIGHT = 48;

const useStyles = makeStyles<{
  headerAdjust: number;
}>()((theme, { headerAdjust }) => ({
  root: {
    position: "relative",
    width: "100%",
  },
  headerFixed: {
    position: "fixed",
    top: headerAdjust,
  },
  header: {
    width: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    marginBottom: theme.spacing(1),
    "& > *": {
      flex: 1,
    },
  },
  headerContent: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  tabs: {
    flex: 1,
  },
  adjust: {
    paddingBottom: TAB_HEIGHT,
  },
  tabsRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT,
  },
  tabRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT,
  },
  indicator: {
    height: 4,
    background: theme.palette.primary.main,
  },
}));

export const TabContent = ({
  children,
  items,
  onChange,
  withFixedPos,
  fixedPosHeaderAdjust: headerAdjust,
}: IContentProps) => {

  const menuRef = useRef<HTMLInputElement>(null);

  const [fixedPos, setFixedPos] = useState(false);

  const { classes } = useStyles({
    headerAdjust,
  });

  useEffect(() => {
    const { current: sideMenu } = menuRef;
    const container = sideMenu?.closest(`.${MASTER_DETAIL_ROOT}`);
    if (withFixedPos && sideMenu && container) {
      const handler = () => {
        let { top: initialTop } = container.getBoundingClientRect();
        const { scrollTop } = document.documentElement;
        initialTop += scrollTop;
        setFixedPos(scrollTop > initialTop);
      };
      handler();
      document.addEventListener('scroll', handler);
      return () => document.removeEventListener('scroll', handler);
    }
    return undefined;
  }, [menuRef.current]);

  const activeId = useMemo(() => {
    return items.find(({ active }) => active)?.id || "unknown";
  }, [items]);

  return (
    <Box className={classes.root}>
      <Paper
        className={classNames(classes.header, {
          [classes.headerFixed]: withFixedPos && fixedPos,
        })}
      >
        <Box className={classes.headerContent}>
          <Tabs
            className={classes.tabs}
            variant="scrollable"
            indicatorColor="primary"
            value={activeId}
            classes={{
              root: classes.tabsRoot,
              indicator: classes.indicator,
            }}
            onChange={(_, value) => onChange(value)}
          >
            {items.map(({ id, label, disabled, icon: Icon }, idx) => (
              <Tab
                key={`${id}-${idx}`}
                label={label}
                value={id}
                disabled={disabled}
                icon={Icon && <Icon />}
                iconPosition="start"
                classes={{
                  root: classes.tabRoot,
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Paper>
      {withFixedPos && <div className={classes.adjust} />}
      {children}
    </Box>
  );
};

export default TabContent;
