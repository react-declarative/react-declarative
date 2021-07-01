import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import classNames from "../../../../utils/classNames";

import IListProps, { IListState, IListCallbacks, IRowData } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';

import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";

import More from "@material-ui/icons/ExpandMore";
import Less from "@material-ui/icons/ExpandLess";

import MatList from '@material-ui/core/List';
import MatListItem from '@material-ui/core/ListItem';
import MatListItemIcon from '@material-ui/core/ListItemIcon';
import MatListItemText from '@material-ui/core/ListItemText';

import DraftsIcon from "@material-ui/icons/Drafts";

interface IMobileItemProps<FilterData extends IRowData = IAnything, RowData extends IRowData = IAnything> extends
  IListProps<FilterData, RowData>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  data: RowData;
  style?: React.CSSProperties;
  className?: string;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderBottom: "1px solid gray",
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
  FilterData extends IRowData = IAnything,
  RowData extends IRowData = IAnything,
>({ className, style }: IMobileItemProps<FilterData, RowData>) => {
  const classes = useStyles();
  const [opened, setOpened] = useState(false);
  const handleOpen = () => setOpened(!opened);

  /*const items = data.block.departments
    ? Object.values<any>(data.block.departments)
    : [];

  const labels = items.map(({ department, departmentColor }) => ({
    text: department,
    color: departmentColor,
  }));*/

  const labels: any[] = [];

  return (
    <div className={classNames(classes.root, className)} style={style}>
      <div className={classes.header} onClick={handleOpen}>
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
      <Collapse in={opened}>
        <div className={classes.content}>
          <MatList>
            <MatListItem>
              <MatListItemIcon>
                <DraftsIcon />
              </MatListItemIcon>
              <MatListItemText primary="Drafts" />
            </MatListItem>
          </MatList>
        </div>
      </Collapse>
    </div>
  );
};

export default MobileItem;
