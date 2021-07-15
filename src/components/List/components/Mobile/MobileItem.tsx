import * as React from "react";
import { useRef, useState, forwardRef } from "react";

import { makeStyles } from "@material-ui/core";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import classNames from "../../../../utils/classNames";

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";

import More from "@material-ui/icons/ExpandMore";
import Less from "@material-ui/icons/ExpandLess";

import Paper from '@material-ui/core/Paper';
import MatList from '@material-ui/core/List';
import MatListItem from '@material-ui/core/ListItem';
import MatListItemIcon from '@material-ui/core/ListItemIcon';
import MatListItemText from '@material-ui/core/ListItemText';

import DraftsIcon from "@material-ui/icons/Drafts";

export const ROW_BOTTOM_MARGIN = 25;

interface IMobileItemProps<FilterData extends IAnything = IAnything, RowData extends IRowData = IAnything> extends
  IListProps<FilterData, RowData>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  data: RowData;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  onResize?: (height: number) => void;
}

const useStyles = makeStyles({
  root: {
    paddingBottom: ROW_BOTTOM_MARGIN,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderBottom: "1px solid transparent",
  },
  header: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: "100%",
  },
  item: {
    flex: 1,
    margin: 10,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
  },
  labels: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    marginBottom: -4,
    "& > span": {
      padding: 5,
      marginRight: 4,
      marginBottom: 4,
    },
  },
  icon: {
    minWidth: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    background: "#00000008",
    padding: 10,
  },
});

export const MobileItem = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >({ className, style, onResize }: IMobileItemProps<FilterData, RowData>, forwardRef: any) => {
  const classes = useStyles();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const handleOpen = () => setOpened(!opened);

  /*const items = data.block.departments
    ? Object.values<any>(data.block.departments)
    : [];

  const labels = items.map(({ department, departmentColor }) => ({
    text: department,
    color: departmentColor,
  }));*/

  const handleResize = () => {
    const { current: header } = headerRef;
    const { current: content } = contentRef;
    let total = 2 * ROW_BOTTOM_MARGIN;
    if (header) {
      const { clientHeight } = header;
      total += clientHeight;
    }
    if (content && opened) {
      const { clientHeight } = content;
      total += clientHeight;
    }
    onResize && onResize(total);
  };

  const labels: any[] = [];

  return (
    <div ref={forwardRef} className={classNames(classes.root, className)} style={style}>
      <Paper className={classes.root}>
        <div ref={headerRef} className={classes.header} onClick={handleOpen}>
          <div className={classes.item}>
            <h3
              style={{
                color: "rgb(101, 109, 120)",
                margin: 0,
              }}
            >
              Title
            </h3>
            <div className={classes.labels}>
              {labels.map((label, idx: number) => (
                <span
                  key={idx}
                  style={{
                    color: label.color,
                    background: lighten(label.color, 0.7),
                    fontWeight: "bold",
                  }}
                >
                  {label.text}
                </span>
              ))}
            </div>
          </div>
          <div className={classes.icon}>
            <IconButton onClick={handleOpen}>
              {opened ? <Less /> : <More />}
            </IconButton>
          </div>
        </div>
        <Collapse in={opened} onEnter={handleResize} onExit={handleResize}>
          <div ref={contentRef} className={classes.content}>
            <MatList style={{ padding: 0, margin: 0 }}>
              <MatListItem>
                <MatListItemIcon>
                  <DraftsIcon />
                </MatListItemIcon>
                <MatListItemText primary="Drafts" />
              </MatListItem>
            </MatList>
          </div>
        </Collapse>
      </Paper>
    </div>
  );
};

export default forwardRef(MobileItem) as typeof MobileItem;
