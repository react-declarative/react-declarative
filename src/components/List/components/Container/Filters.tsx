import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';

import { makeStyles } from "../../../../styles";
import { alpha } from '@mui/material/styles';

import classNames from '../../../../utils/classNames';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Restore from '@mui/icons-material/Restore';
import More from '@mui/icons-material/ExpandMore';
import Less from '@mui/icons-material/ExpandLess';

import IAnything from '../../../../model/IAnything';
import IField from '../../../../model/IField';

import One from '../../../One';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    background: alpha(
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
    display: "flex",
    alignItems: "center",
  },
  controlsWidth: {
    minWidth: 80,
  },
  title: {
    height: 60,
    display: "flex",
    alignItems: "center",
    paddingLeft: 10,
  },
  disabled: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.5,
  }
}));

interface IFiltersProps<FilterData = IAnything> {
  className?: string;
  filterData: FilterData;
  style?: React.CSSProperties;
  filters: IField<FilterData>[];
  change: (data: FilterData) => void;
  onFilterChange?: (data: FilterData) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  toggleFilters?: boolean;
  ready: () => void;
  clean: () => void;
  loading: boolean;
  label: string;
}

export const Filters = <FilterData extends IAnything>({
  className,
  style,
  filterData,
  filters,
  change,
  ready,
  clean,
  label,
  loading,
  toggleFilters,
  onFilterChange = () => null,
  onCollapsedChange = () => null,
}: IFiltersProps<FilterData>) => {

  const classes = useStyles();

  const [collapsed, setCollapsed] = useState(!!toggleFilters);
  const [disabled, setDisabled] = useState(false);

  const isInitialized = useRef(false);

  const handleCollapse = () => setCollapsed(!collapsed);

  const handleChange = (data: FilterData) => {
    onFilterChange(data);
    change(data);
  };

  useEffect(() => {
    if (isInitialized.current) {
      setDisabled(true);
      /* react transitioncancel hack */
      setTimeout(handleCollapseEnd, 1_000);
    }
  }, [collapsed]);

  useEffect(() => {
    isInitialized.current = true;
    return () => {
      isInitialized.current = false;
    };
  }, []);

  const handleCollapseEnd = useCallback(() => {
    if (isInitialized.current) {
      onCollapsedChange(collapsed);
      setTimeout(() => setDisabled(false), 100);
    }
  }, [collapsed]);

  return (
    <div className={classNames(className, classes.root)} style={style}>
      <div className={classes.container}>
        <Collapse
          onTransitionEnd={handleCollapseEnd}
          in={collapsed}
        >
          <Box p={1} className={classNames({
            [classes.disabled]: loading,
          })}>
            <One<FilterData>
              handler={filterData}
              fields={filters}
              change={handleChange}
              ready={ready}
              readonly={loading}
            />
          </Box>
        </Collapse>
        <Collapse in={!collapsed}>
          <Typography variant="body1" className={classes.title}>
            {label}
          </Typography>
        </Collapse>
      </div>
      <div className={classNames(classes.controls, {
        [classes.controlsWidth]: !toggleFilters,
      })}>
        <IconButton disabled={loading} onClick={clean}>
          <Restore />
        </IconButton>
        {!toggleFilters && (
          <IconButton disabled={disabled} onClick={handleCollapse}>
            {collapsed ? <Less /> : <More />}
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Filters;
