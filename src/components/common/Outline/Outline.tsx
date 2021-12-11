import * as React from 'react';

import { makeStyles, Box } from '@material-ui/core';

import Group from '../Group';

import classNames from '../../../utils/classNames';

import { PickProp } from '../../../model/IManaged';
import IAnything from '../../../model/IAnything';
import IField from '../../../model/IField';

const useStyles = makeStyles((theme) => ({
  strech: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
  },
  content: {
    flexGrow: 1,
    width: "100%",
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface IOutlineProps<Data = IAnything> {
  className?: PickProp<IField<Data>, 'className'>;
  style?: PickProp<IField<Data>, 'style'>;
}

interface IOutlinePrivate {
  children: React.ReactChild;
}

export const Outline = ({
  className = "",
  style,
  children,
}: IOutlineProps & IOutlinePrivate) => {
  const classes = useStyles();
  return (
    <Box className={classNames(className, classes.strech)} style={style}>
      <Box className={classes.content}>
        <Group
          fieldBottomMargin="0"
          fieldRightMargin="0"
        >
          {children}
        </Group>
      </Box>
    </Box>
  );
};

Outline.displayName = 'Outline';

export default Outline;
