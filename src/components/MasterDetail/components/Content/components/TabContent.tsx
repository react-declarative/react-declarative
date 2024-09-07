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

import { MASTER_DETAIL_HEADER, MASTER_DETAIL_ROOT } from "../../../config";

const TAB_HEIGHT = 54;
const HEADER_HEIGHT = 64;

const useStyles = makeStyles()((theme) => ({
  root: {
    position: "relative",
    width: "100%",
  },
  header: {
    height: HEADER_HEIGHT,
    background: theme.palette.background.default,
    display: "flex",
    alignItems: "center",
    zIndex: 9,
  },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerFixed: {
    position: "fixed",
  },
  headerNone: {
    visibility: "hidden",
    pointerEvents: "none",
  },
  adjust: {
    paddingBottom: HEADER_HEIGHT,
  },
  paper: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
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
  disabledTab: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  indicator: {
    height: 4,
    background: theme.palette.primary.main,
  },
}));

/**
 * Represents a TabContent component.
 * @function TabContent
 * @param props - The component props.
 * @param props.children - The content to be rendered inside the TabContent component.
 * @param props.items - An array of objects representing the tabs items. Each object should have an `id`, `label`, `disabled`, and optionally an `icon` property.
 * @param props.onChange - The callback function to be called when the active tab changes.
 * @param props.loading - Indicates if the component is in a loading state.
 * @param props.withFixedPos - Indicates if the component should have a fixed position.
 * @param props.withTransparentTabs - Indicates if the component should have transparent tabs.
 * @param props.fixedPosHeaderAdjust - The adjustment value for the header when the component has a fixed position.
 * @returns The rendered TabContent component.
 */
export const TabContent = ({
  children,
  items,
  onChange,
  loading,
  withFixedPos,
  withTransparentTabs,
  fixedPosHeaderAdjust: headerAdjust,
}: IContentProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    elementRef,
    size: { width },
  } = useElementSize();

  const [fixedPos, setFixedPos] = useState(false);

  const { classes } = useStyles();

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
  }, [menuRef.current, loading]);

  const activeId = useMemo(() => {
    return items.find(({ active }) => active)?.id || "unknown";
  }, [items]);

  /**
   * Renders a set of tabs with customizable properties.
   *
   * @returns The rendered tabs component.
   */
  const renderTabs = () => (
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
          className={classNames({
            [classes.disabledTab]: disabled,
          })}
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
  );

  /**
   * Renders the inner content of the component.
   *
   * @returns The inner content JSX element.
   */
  const renderInner = () => {
    if (withTransparentTabs) {
      return (
        <Box
          className={MASTER_DETAIL_HEADER}
          sx={{
            zIndex: 9,
          }}
        >
          {renderTabs()}
        </Box>
      )
    }
    return (
      <Box
        className={classNames(MASTER_DETAIL_HEADER, classes.header, {
          [classes.headerNone]: !items.length,
          [classes.headerAbsolute]: !fixedPos,
          [classes.headerFixed]: fixedPos,
        })}
        sx={{
          ...(fixedPos && {
            top: `${headerAdjust}px`,
          }),
          width: width || "100%",
        }}
      >
        <Paper className={classes.paper} sx={{ width: width || "100%" }}>{renderTabs()}</Paper>
      </Box>
    );
  };

  return (
    <Box ref={elementRef} className={classes.root}>
      {renderInner()}
      {!withTransparentTabs && (
        <div
          ref={menuRef}
          className={classNames({
            [classes.adjust]: !!items.length,
          })}
        />
      )}
      {children}
    </Box>
  );
};

export default TabContent;
