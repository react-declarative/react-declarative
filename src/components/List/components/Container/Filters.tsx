import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

import classNames from '../../../../utils/classNames';

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Delete from '@material-ui/icons/Delete';
import More from '@material-ui/icons/ExpandMore';
import Less from '@material-ui/icons/ExpandLess';

import IAnything from '../../../../model/IAnything';
import IField from '../../../../model/IField';

import One from '../../../One';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: fade(
      theme.palette.getContrastText(theme.palette.background.paper),
      0.05
    ),
  },
  container: {
    flex: 1,
    minHeight: 60,
    maxHeight: "50vh",
    overflow: "hidden",
    overflowY: "auto",
  },
  controls: {
    minWidth: 80,
    display: "flex",
    alignItems: "center",
  },
  title: {
    height: 60,
    display: "flex",
    alignItems: "center",
    marginLeft: 10,
  },
}));

interface IFiltersProps<FilterData = IAnything> {
  className?: string;
  filterData: FilterData;
  style?: React.CSSProperties;
  filters: IField<FilterData>[];
  change: (data: FilterData) => void;
  clean: () => void;
  label: string;
}

export const Filters = <FilterData extends IAnything>({
  className,
  style,
  filterData,
  filters,
  change,
  clean,
  label,
}: IFiltersProps<FilterData>) => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Collapse in={collapsed}>
          <Box p={1}>
            <One<FilterData>
              handler={filterData}
              fields={filters}
              change={change}
            />
          </Box>
        </Collapse>
        <Collapse in={!collapsed}>
          <Typography variant="body1" className={classes.title}>
            {label}
          </Typography>
        </Collapse>
      </div>
      <div className={classes.controls}>
        <IconButton onClick={clean}>
          <Delete />
        </IconButton>
        <IconButton onClick={handleCollapse}>
          {collapsed ? <Less /> : <More />}
        </IconButton>
      </div>
    </div>
  );
};

export default Filters;
