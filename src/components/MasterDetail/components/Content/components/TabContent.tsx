import * as React from "react";
import { useMemo, useState, useRef, useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { makeStyles } from "../../../../../styles";

import classNames from "../../../../../utils/classNames";

import useElementSize from "../../../../../hooks/useElementSize";

import IContentProps from "../IContentProps";

import { MASTER_DETAIL_ROOT } from "../../../config";

const TAB_HEIGHT = 72;
const HEADER_HEIGHT = 82;

const useStyles = makeStyles<{
  headerAdjust: number;
  width: string | number;
}>()((theme, { headerAdjust: top, width }) => ({
  root: {
    position: "relative",
    width: '100%',
  },
  header: {
    height: HEADER_HEIGHT,
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    zIndex: 9,
    width,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerFixed: {
    position: 'fixed',
    top,
  },
  adjust: {
    paddingBottom: TAB_HEIGHT,
  },
  paper: {
    width,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    '& > *': {
      flex: 1,
    },
  },
  tabsRoot: {
    minHeight: TAB_HEIGHT,
    height: TAB_HEIGHT,
    marginLeft: "0 !important",
    marginRight: "0 !important",
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

  const menuRef = useRef<HTMLDivElement>(null);

  const { elementRef, size: { width } } = useElementSize({
    width: '100%',
  });

  const [fixedPos, setFixedPos] = useState(false);

  const { classes } = useStyles({
    headerAdjust,
    width,
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
      document.addEventListener("scroll", handler);
      return () => document.removeEventListener("scroll", handler);
    }
    return undefined;
  }, [menuRef.current]);

  const activeId = useMemo(() => {
    return items.find(({ active }) => active)?.id || "unknown";
  }, [items]);

  return (
    <Box ref={elementRef} className={classes.root}>
      <Box 
        className={classNames(classes.header, {
          [classes.headerAbsolute]: !fixedPos,
          [classes.headerFixed]: fixedPos,
        })}
      >
        <Paper className={classes.paper}>
          <Tabs
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
        </Paper>
      </Box>
      <div ref={menuRef} className={classes.adjust} />
      {children}
    </Box>
  );
};

export default TabContent;
