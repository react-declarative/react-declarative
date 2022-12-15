import * as React from 'react';
import { useState, useEffect } from 'react';

import { makeStyles } from '../../../styles';

import MuiCollapse from '@mui/material/Collapse';
import Box, { BoxProps } from '@mui/material/Box';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles()((theme) => ({
  label: {
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.primary.main,
  },
}));

export interface ICollapseProps extends Omit<BoxProps, keyof {
  title: never;
}> {
  title?: React.ReactNode;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
};

export const Collapse = ({
  children,
  title,
  checked: upperChecked,
  onCheck,
  ...otherProps
}: ICollapseProps) => {
  const { classes } = useStyles();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (upperChecked !== undefined) {
      setChecked(upperChecked);
    }
  }, [upperChecked]);

  const handleChange = () => {
    const newValue = !checked;
    if (onCheck) {
      onCheck(newValue);
    }
    setChecked(newValue);
  };

  return (
    <Box {...otherProps}>
      <Box className={classes.label} role="none" onClick={handleChange}>
        <strong>{title || 'Show details'}</strong> <ArrowDropDownIcon />
      </Box>
      <MuiCollapse in={checked}>
        {children}
      </MuiCollapse>
    </Box>
  );
};

export default Collapse;
