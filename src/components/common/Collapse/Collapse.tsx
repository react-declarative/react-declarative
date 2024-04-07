import * as React from 'react';
import { useState, useEffect } from 'react';

import { makeStyles } from '../../../styles';

import MuiCollapse from '@mui/material/Collapse';
import Box, { BoxProps } from '@mui/material/Box';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

/**
 * Returns the styles for a component using the makeStyles hook.
 *
 * @returns The styles object containing classes for different elements.
 */
const useStyles = makeStyles()((theme) => ({
  label: {
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.primary.main,
  },
}));

/**
 * Interface for the Collapse component props.
 */
export interface ICollapseProps extends Omit<BoxProps, keyof {
  title: never;
}> {
  title?: React.ReactNode;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
};

/**
 * Represents a collapsible component with optional title and child content.
 * The collapse state can be controlled using the `checked` prop.
 *
 * @param props - The component props.
 * @param props.children - The child content to be displayed when the collapse is expanded.
 * @param props.title - The optional title of the collapse.
 * @param props.checked - The initial state of the collapse. If true, the collapse is expanded. If false, the collapse is collapsed.
 * @param props.onCheck - The callback function called when the collapse state is changed. It receives the new state as an argument.
 * @param props.otherProps - Additional props to be spread to the root Box component.
 * @returns The rendered collapse component.
 */
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

  /**
   * Function that handles a change in value.
   *
   * @function
   * @name handleChange
   */
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
