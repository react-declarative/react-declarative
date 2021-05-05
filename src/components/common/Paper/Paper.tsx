import * as React from 'react';

import { makeStyles, Paper as MatPaper, Box } from '@material-ui/core';

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
  },
  content: {
    flexGrow: 1,
    width: "100%",
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface IPaperProps<Data = IAnything> {
  className?: PickProp<IField<Data>, 'className'>;
  style?: PickProp<IField<Data>, 'style'>;
}

interface IPaperPrivate {
  children: React.ReactChild;
}

export const Paper = ({
  className = "",
  style,
  children,
}: IPaperProps & IPaperPrivate) => {
  const classes = useStyles();
  return (
    <MatPaper className={classNames(className, classes.strech)} style={style}>
      <Box p={2} className={classes.content}>
        <Group>{children}</Group>
      </Box>
    </MatPaper>
  );
};

Paper.displayName = 'Paper';

export default Paper;
